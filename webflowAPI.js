const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs").promises;

const collectionURL = 'https://api.webflow.com/collections';

// this function returns the url for a specific collection
function getItemUrl(collectionID) {
    return 'https://api.webflow.com/collections/' + collectionID + '/items';
}

class WebFlowAPI {
    apiKey = '';

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    // https://developers.webflow.com/reference/list-collections
    // This lists the collections that were made on the site in the Webflow CMS, not the content;
    async getCollections(siteID) {
        try {
            const url = 'https://api.webflow.com/sites/' + siteID + '/collections';
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                }
            };

            const response = await fetch(url, options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.log(err);
        }
    }

    // https://developers.webflow.com/reference/get-collection
    // IMPORTANT: Doesn't output the content; only the 'model'
    // i.e. the fields and their types etc.
    async getCollectionModel(collectionID) {
        try {
            const url = collectionURL + '/' + collectionID;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                }
            };

            const response = await fetch(url, options);
            console.log(await response.json());
            return await response.json();
        } catch (err) {
            return err;
        }
    }

    // https://developers.webflow.com/reference/list-items
    // Function lists all items in a collection
    async getCollectionItems(collectionID) {
        try {
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                }
            };

            const response = await fetch(getItemUrl(collectionID), options);
            const json = await response.json();
            return json;
        } catch (err) {
            console.error(err);
        }
    }

    // https://developers.webflow.com/reference/get-item
    // Function gets a specific item from a collection, that is passed as a parameter(collectionID and itemID);
    async getItem(collectionID, itemID) {
        try {
            const itemURL = getItemUrl(collectionID) + '/' + itemID;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                }
            };

            const response = await fetch(itemURL, options);
            console.log(await response.json());
            return await response.json();
        } catch (err) {
            console.error(err);
        }
    }

    // https://developers.webflow.com/reference/create-item
    // Adds a new item to the collection, that is passed as a parameter(collectionID);
    // set the image field to the url of the image you want to use;
    // If you create a new item you either can add ?live=true to the url or call the publish function after creating the item;
    async createNewItem(collectionID) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                },
                body: JSON.stringify({
                    fields: {
                        slug: 'autohaus-fahrschule-calw',
                        name: 'Die Autohaus Fahrschule - Calw',
                        description: 'Egal ob Auto, Motorrad oder Anhänger - Die Autohaus Fahrschule in Calw ist die richtige Wahl wenn es um den Führerschein geht. Besonders bei B96 wird auf eine praxisgerechte Ausbildung geachtet - mit vielen Tipps und Kniffen lernst du den Umgang mit dem Anhänger. Unsere motivierten Ausbilder und Ausbilderinnen stehen dir mit Rat zur Seite und haben immer ein offenes Ohr für dich.',
                        location: 'Calw',
                        image: "https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=1600",
                        price: 300,
                        amount: 3,
                        _archived: false,
                        _draft: false
                    }
                })
            };

            const response = await fetch(getItemUrl(collectionID), options);
            const json = await response.json();
            await this.publishCollectionItems(collectionID, [json['_id']]);
        } catch (err) {
            console.error(err);
        }
    }

    // creates multiple items in a collection;
    // these items are read from a json file(Upload/data.json);
    // set the image field to the url of the image you want to use;
    // Same for this function, you either can add ?live=true to the url or call the publish function after creating the item;
    async createNewItems(collectionID) {
        try {
            const filePath = path.join('Upload', 'data.json');
            const data = await fs.readFile(filePath, 'utf8');
            const parsedData = JSON.parse(data);
            // the parameter name `fields` is required by the API, and is not meant to be changed;
            for (const fields of parsedData) {
                const options = {
                    method: 'POST',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        authorization: 'Bearer ' + this.apiKey
                    },
                    body: JSON.stringify({fields})
                };

                // either use getItemUrl(collectionID) + '?live=true' or call the publish function after creating the item;
                const response = await fetch(getItemUrl(collectionID), options);
                const json = await response.json();
                await this.publishCollectionItems(collectionID, [json['_id']]);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // https://developers.webflow.com/reference/remove-item
    // Removes a specific item from a collection, that is passed as a parameter(collectionID and itemID);
    deleteItem(collectionID, itemID) {
        // TODO: test if it would work with the publish function;

        // THIS JUST UNPUBLISHES THE ITEM, DOESN'T DELETE IT;
        let removeItemUrl = getItemUrl(collectionID) + '/' + itemID + '?live=true';
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer e285d698927360729edcc86bf980938968349a7da9bf60b9353dbbddfdfd927b'
            }
        };

        fetch(removeItemUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));

        // THIS DELETES THE ITEM;
        removeItemUrl = getItemUrl(collectionID) + '/' + itemID;
        fetch(removeItemUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));
    }

    // https://developers.webflow.com/reference/remove-items
    // Removes multiple items from a collection, that is passed as a parameter(collectionID and itemIDs);
    // itemIDs is an array of itemIDs(Strings);
    async deleteItems(collectionID, itemIDs) {
        // THIS JUST UNPUBLISHES THE ITEM, DOESN'T DELETE IT(Because of the `?live=true` parameter);
        const deleteUrl = getItemUrl(collectionID) + '?live=true';
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Bearer ' + this.apiKey
            },
            body: JSON.stringify({itemIds: itemIDs})
        };

        await fetch(deleteUrl, options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));

        // THIS DELETES THE ITEM;
        await fetch(getItemUrl(collectionID), options)
            .then(res => res.json())
            .then(json => console.log(json))
            .catch(err => console.error('error:' + err));

    }

    async deleteItemBySlug(collectionID, slug) {
        const response = await this.getCollectionItems(collectionID);
        const items = response['items'];
        for (const item of items) {
            if (item['slug'] === slug) {
                await this.deleteItem(collectionID, item['_id']);
                return;
            }
        }
    }

    // https://developers.webflow.com/reference/publish-items
    async publishCollectionItems(collectionID, itemIDs) {
        try {
            const publishUrl = getItemUrl(collectionID) + '/publish';
            const options = {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                },
                body: JSON.stringify({itemIds: itemIDs})
            };
            const response = await fetch(publishUrl, options);
            console.log(await response.json());
            return await response.json();
        } catch (err) {
            console.error(err);
        }
    }

    // https://developers.webflow.com/reference/update-item
    async updateSchool(collectionID, itemID) {
        // TODO: Check if the item is published or not;
        try {
            const updateUrl = getItemUrl(collectionID) + '/' + itemID;
            const options = {
                method: 'PUT',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: 'Bearer ' + this.apiKey
                },
                body: JSON.stringify({
                    fields: {
                        slug: 'my-new-school2',
                        name: 'School Bournemouth',
                        description: 'School Bournemouth',
                        location: 'New York, NY',
                        price: 199,
                        amount: 2,
                        _archived: false,
                        _draft: false
                    }
                })
            };

            const response = await fetch(updateUrl, options);
            console.log(await response.json());
            return await response.json();
        } catch (err) {
            console.error(err);
        }
    }

    // https://developers.webflow.com/reference/patch-item
    async patchCollectionItem(collectionID, itemID) {
        try {
            const patchUrl = getItemUrl(collectionID) + '/' + itemID;
            const options = {
                method: 'PATCH',
                headers: {
                    accept: 'application/json', 'content-type': 'application/json',
                    authorization: 'Bearer ' + this.apiKey,
                },
                body: JSON.stringify({
                    fields: {
                        slug: 'my-new-school2',
                        name: 'School Bournemouth',
                        description: 'School Bournemouth',
                        location: 'New York, NY',
                        image: 'https://uploads-ssl.webflow.com/64ac2f8adeaebc017bd5c862/64ae6274813ba32c4ad4c311_Screenshot%202023-07-12%20at%209.20.45%E2%80%AFAM-p-500.png',
                        price: 199,
                        amount: 2,
                        _archived: false,
                        _draft: false
                    }
                })
            };

            const response = await fetch(patchUrl, options);
            console.log(await response.json());
            return await response.json();
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = WebFlowAPI