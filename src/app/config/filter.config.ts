const priceHandlerMatches = [
    {low: 0, high: 24, label: 'under 25'},
    {low: 25, high: 50, label: '25 to 50'},
    {low: 50, high: Infinity, label: 'over 50'}
];

const getValueForAttribute = (item, key) => {
    // if this was more than 4x, then it would be worth benching
    // different approaches, as is, the [] loop is probably fastest
    // vs creating a lookup to be used 3x more times
    for(let x = 0; x < item.custom_attributes.length; x += 1) {
        if(item.custom_attributes[x].attribute_code === key) {
            return item.custom_attributes[x].value;
        }
    }
}

const getValueForCommaDelimitedAttribute = (item, key) => {
    const val = getValueForAttribute(item, key);
    return val && val.split(',');
}

export const filterConfig = [
    {
        key: 'price',
        getValue: (item) => {
            let label = 'unknown';
            // for in so can break easily
            for(const match in priceHandlerMatches) {
                const matchDetails = priceHandlerMatches[match];
                if(item.price >= matchDetails.low && item.price <= matchDetails.high) {
                    label = matchDetails.label;
                    break;
                }
            }
            return [label];
        }
    },
    {
        key: 'category_ids',
        getValue: (item) => {
            return getValueForAttribute(item, 'category_ids');
        }
    },
    {
        key: 'size',
        getValue: (item) => {
            return getValueForCommaDelimitedAttribute(item, 'size');
        }
    },
    {
        key: 'material',
        getValue: (item) => {
            return getValueForCommaDelimitedAttribute(item, 'material');
        }
    }
];
