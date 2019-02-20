# Applicant as Frontend Developer - Senior Level

The task is to create a product-list with filters in angular. The data you are
using is here a plain json file, which is holding ALL products (2046) from a
default magento 2 store with demodata installed. You dont have to take care of
good design or the product-images, just show some "tile" with a
placeholder-image, the product's name and price for every product.
The attributes inside the data are just holding attribute-ids, so the list of
the filters will also not be very pretty or usable for a "real-user" because
nobody knowns what "material 31" is, but this is not important for this task.
So here is a clear description of what to do:

- Create a product-list out of the provided data.
- The list of products needs to paginated.
- A single page should be 96 items long.
- Every item is holding a placeholder-image, the products name, and the products
  price.
- On the left-hand of the product-list you create a list of filters.
- The filters are generated out of the attributes of the available products
  inside the current product-list, so if we filtered the list, the available
  filters will be less than before
- Available filters should be "category", "price", "size" and "material".
- The filter for "price" should be something like "under 100", "100 until 200"
  and "above 200"
- The attributes you create the filters from are just holding attribute-ids,
  so the list of filters will als show values like "material 31". If you click
  on it, the product-list is showing only items that have the attribute-value
  "31" inside the attribute "material".
- At NO time during runtime, the application should freeze...also (especially)
  not on mobiles.

The data is included inside this repository. If you have any questions,
please feel free to contact me 😊

So good luck and much fun during the development,
Alex
