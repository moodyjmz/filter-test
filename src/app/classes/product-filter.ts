type AttributeConfig = {
  key: string;
  getValue: (item: string | [] | number) => [];
};

export type FilterGroup = {
  key: string;
  properties: any[];
}

/**
 * Map Items to attributes
 * price_key > Set([items matching price key])
 */
type AttributeMap = Map<string, Set<object>>;

/**
 * Filters products using config
 *
 * Provides list of filters and products
 * Tracks filter usage and provides hooks for
 * presentation layer to determine state
 */
export class ProductFilter {

  /**
   * Internal reference for Attribute config
   */
  readonly config: AttributeConfig[] = [];

  /**
   * Maps of items by attribute
   *
   * Object holding Maps of Attributes
   *
   * Each Map holds a Set of items for each property assigned
   * to an attribute
   */
  private attributeMaps: { AttributeMap? } = {};

  /**
   * item id > storage
   *
   * Used to lookup item filters without indexOf
   */
  private itemPropertyMap = {};

  constructor(config: AttributeConfig[]) {
    this.config = config;
    this.createAttributeLookupMaps(config);
  }

  /**
   * Set data to create filters from
   * @param data Product items
   */
  public set data(data) {
    // console.time('PF import');
    data.forEach(this.initItemFilterValues, this);
    // console.timeEnd('PF import');
  }

  /**
   *
   */
  public get allFilters(): FilterGroup[] {
    const filters = [];
    for (let key in this.attributeMaps) {
      filters.push(this.constructFilterGroup(key, this.attributeMaps[key]));
    }
    return filters;
  }

  /**
   * Filter data based on config
   * @param config Filter config
   * @returns Array of items matching filter config
   */
  public getFilteredData(config: FilterGroup[]): any[] {
    const candidateItems = new Set();
    const setsToCheck = this.getSetsToCheck(config);
    const smallestSet = setsToCheck.shift() as Set<{}>;

    // smallestSet is still a reference to a stored set
    // so we copy it
    smallestSet.forEach((item) => {
      candidateItems.add(item);
    });

    // go through smallest set, testing against each other set
    // candidateItems will shrink
    candidateItems.forEach((item: {}) => {
      setsToCheck.forEach((set: Set<{}>) => {
        if (!set.has(item)) {
          candidateItems.delete(item);
        }
      })
    });
    return [...candidateItems];
  }

  public getAvailableFiltersFromItems(items): Map<string, Set<string | number>> {
    const tempFilterGroups = {};
    for (let key in this.attributeMaps) {
      // use array as don't care about duplicates
      // using set is not good as does integrity check each add
      tempFilterGroups[key] = [];
    }
    items.forEach((item: { id }) => {
      for (let key in tempFilterGroups) {
        if (this.itemPropertyMap[item.id][key]) {
          this.itemPropertyMap[item.id][key].forEach((prop) => {
            tempFilterGroups[key].push(prop);
          });
        }
      }
    });
    const filterGroups = new Map();
    for (const key in tempFilterGroups) {
      // removes dupes in Set
      filterGroups.set(key, new Set(tempFilterGroups[key]));
    }
    return filterGroups;
  }

  /**
   * Construct filter group
   * Groups all properties used by filter type
   * @param key Filter name
   * @param attrMap Attribute map to construct from
   * @returns {@link FilterGroup}
   */
  private constructFilterGroup(key, attrMap: AttributeMap): FilterGroup {
    const filterGroup: FilterGroup = {key: key, properties: []};
    attrMap.forEach((group, key) => {
      filterGroup.properties.push(key);
    });
    return filterGroup;
  }

  /**
   * Create Attribute Maps from config
   * @param config Config to use
   * @returns {void}
   */
  private createAttributeLookupMaps(config: AttributeConfig[]): void {
    config.forEach(this.createAttributeMap, this);
  }

  /**
   * Create Maps for each attribute
   * @param attrConfig Attribute config
   * @returns {void}
   */
  private createAttributeMap(attrConfig: AttributeConfig): void {
    if (this.attributeMaps[attrConfig.key]) {
      this.attributeMaps[attrConfig.key].clear();
    } else {
      this.attributeMaps[attrConfig.key] = new Map();
    }
  }

  /**
   * Associates items with property set inside attribute maps
   * @param attrKey Attribute key
   * @param properties Properties of item to associate
   * @param item Item to place into properties sets
   * @returns {void}
   */
  private associatePropertiesAndItem(attrKey: string, properties: [], item): void {
    properties.forEach((property) => {
      this.addItemToPropertySet(this.attributeMaps[attrKey], property, item);
    });
  }

  /**
   * Cache item attribute properties by item.id
   * @param item Item to use
   * @param attrKey Attribute key
   * @param properties Properties to cache
   * @returns {void}
   */
  private cacheItemProperties(item, attrKey, properties): void {
    if (!this.itemPropertyMap[item.id]) {
      this.itemPropertyMap[item.id] = {};
    }
    this.itemPropertyMap[item.id][attrKey] = properties;
  }

  /**
   * Place an item into an attribute map property set
   * @param attrMap Attribute Map to use
   * @param property Property key
   * @param item Item to place into property Set
   * @returns {void}
   */
  private addItemToPropertySet(attrMap, property, item): void {
    // get/has are almost identical, both iterate, so we can save some lookups
    let propertySet = attrMap.get(property);
    if (propertySet === undefined) {
      attrMap.set(property, new Set());
      propertySet = attrMap.get(property);
    }
    propertySet.add(item);
  }

  /**
   * Use config `getValue` handler to extract properties
   * for filter association
   * @param item Item to extract and associate
   * @returns {void}
   */
  private initItemFilterValues(item): void {
    this.config.forEach((attrConfig: AttributeConfig) => {
      const properties = attrConfig.getValue(item);
      if (properties) {
        this.cacheItemProperties(item, attrConfig.key, properties);
        this.associatePropertiesAndItem(attrConfig.key, properties, item);
      }
    });
  }

  /**
   * Utility method to filter down relevant sets from
   * applied filter
   * @param config Filter applied
   * @returns Array of sets matching, smallest first
   */
  private getSetsToCheck(config: FilterGroup[]): Set<{}>[] {
    const setsToCheck = [];
    config.forEach((filterConfig) => {
      const attrGroup = this.attributeMaps[filterConfig.key];
      filterConfig.properties.forEach((attr) => {
        const smallestCandidateSet = attrGroup.get(attr);
        if (setsToCheck.length) {
          if (smallestCandidateSet.size < setsToCheck[0].size) {
            setsToCheck.unshift(smallestCandidateSet);
          } else {
            setsToCheck.push(smallestCandidateSet);
          }
        } else {
          setsToCheck.push(smallestCandidateSet);
        }
      });
    });
    return setsToCheck;
  }
}
