# Webflow CMS Integration with Node.js

This Node.js script demonstrates how to integrate with the Webflow CMS using the Webflow API. The script allows you to perform various operations such as listing collections, retrieving collection models, listing collection items, creating, updating, and deleting items in a collection, publishing items, and retrieving a specific item from a collection.

## Prerequisites

Before using this script, ensure you have the following:

- Node.js installed on your machine.
- A Webflow account and a Webflow site.
- An API key generated from your Webflow account. The API key should have sufficient permissions to perform the desired operations.

## Installation

1. Clone or download the repository to your local machine.
2. Navigate to the project directory.
3. Install the required dependencies by running the following command:

```shell
npm install
```

## Usage

1. Open the `.env.example` file in a text editor.
2. Rename `.env.example` to `.env`.
3. Replace the placeholders in the script with your actual values:
    - `API_KEY`: Your Webflow API key.
    - `SITE_ID`: The ID of your WebFlow site.
    - `COLLECTION_ID`: The ID of the collection you want to work with.
4. Save the `.env` file and open `app.js`
    - replace the function with the function you want to execute
5. Save the changes to the `app.js` file.
6. Open a terminal or command prompt and navigate to the project directory.
7. Run the following command to execute the script:

```shell
node app.js
```

Remember to modify the line: `webflowAPI.getCollections(siteID)` with the function you want to execute. You can modify this line to call different methods from the `WebFlowAPI` class or create your own custom logic using the provided methods.
### Create Items
When you want to create multiple items, you need to modify the `data.json` file. Remember that you can't upload images directly to your CMS, you can only provide a link to the image.

When creating items, it is also worth saying that they are not published by default. That means that while they get uploaded, they will not be visible for users on your web-site. Note that right now, the method `publishCollectionItems()` is automatically called with the corresponding id, to publish the item. If you wish not to publish the item on creation, simply remove the line in `createNewItem()` where the method is being called. Of course the same applies to `createNewItems()`.

### Removing/Deleting items
Removing items is a bit tricky as it turns out. When you just delete the item, it will not show up on your CMS on WebFlow, but it will still be visible on your website. And when you unpublished the items with `?live=true`, you will see that the item is still in your CMS.
That's why both the functions `removeItem()` and `removeItems()` first unpublished the items and then delete them.

## Documentation

- [Webflow CMS API Documentation](https://developers.webflow.com/reference)

## License

This project is licensed under the [MIT License](LICENSE).
