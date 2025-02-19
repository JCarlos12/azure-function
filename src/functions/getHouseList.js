const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
const data = [
  {
    id: 0,
    name: "Acme Fresh Start Housing",
    city: "Chicago",
    state: "IL",
    photo:
      "https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
    availableUnits: 4,
    wifi: true,
    laundry: true,
  },
  {
    id: 1,
    name: "A113 Transitional Housing",
    city: "Santa Monica",
    state: "CA",
    photo:
      "https://angular.dev/assets/images/tutorials/common/brandon-griggs-wR11KBaB86U-unsplash.jpg",
    availableUnits: 0,
    wifi: false,
    laundry: true,
  },
  {
    id: 2,
    name: "Warm Beds Housing Support",
    city: "Juneau",
    state: "AK",
    photo:
      "https://angular.dev/assets/images/tutorials/common/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
    availableUnits: 1,
    wifi: false,
    laundry: false,
  },
  {
    id: 3,
    name: "Homesteady Housing",
    city: "Chicago",
    state: "IL",
    photo:
      "https://angular.dev/assets/images/tutorials/common/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
    availableUnits: 1,
    wifi: true,
    laundry: false,
  },
  {
    id: 4,
    name: "Happy Homes Group",
    city: "Gary",
    state: "IN",
    photo:
      "https://angular.dev/assets/images/tutorials/common/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
    availableUnits: 1,
    wifi: true,
    laundry: false,
  },
  {
    id: 5,
    name: "Hopeful Apartment Group",
    city: "Oakland",
    state: "CA",
    photo:
      "https://angular.dev/assets/images/tutorials/common/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
    availableUnits: 2,
    wifi: true,
    laundry: true,
  },
  {
    id: 6,
    name: "Seriously Safe Towns",
    city: "Oakland",
    state: "CA",
    photo:
      "https://angular.dev/assets/images/tutorials/common/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
    availableUnits: 5,
    wifi: true,
    laundry: true,
  },
  {
    id: 7,
    name: "Hopeful Housing Solutions",
    city: "Oakland",
    state: "CA",
    photo:
      "https://angular.dev/assets/images/tutorials/common/r-architecture-GGupkreKwxA-unsplash.jpg",
    availableUnits: 2,
    wifi: true,
    laundry: true,
  },
  {
    id: 8,
    name: "Seriously Safe Towns",
    city: "Oakland",
    state: "CA",
    photo:
      "https://angular.dev/assets/images/tutorials/common/saru-robert-9rP3mxf8qWI-unsplash.jpg",
    availableUnits: 10,
    wifi: false,
    laundry: false,
  },
  {
    id: 9,
    name: "Capital Safe Towns",
    city: "Portland",
    state: "OR",
    photo:
      "https://angular.dev/assets/images/tutorials/common/webaliser-_TPTXZd9mOo-unsplash.jpg",
    availableUnits: 6,
    wifi: true,
    laundry: true,
  },
];

const endpoint = process.env.COSMOS_DB_URI;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "ToDoList";
const containerId = "Items";

const client = new CosmosClient({ endpoint, key });

app.http("getHouseList", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);
    context.log(`Method :  ${JSON.stringify(request.method)}`);
    try {
      const database = client.database(databaseId);
      const container = database.container(containerId);

      if (request.method === "GET") {
        const { resources } = await container.items.readAll().fetchAll();
        return {
          body: JSON.stringify(resources),
          headers: { "Content-Type": "application/json" },
        };
      } else if (request.method === "POST") {
        let { id, city } = { ...request.params };

        const { resources } = await container.items
          .query({
            query: "SELECT * from c WHERE c.id = @id",
            parameters: [{ name: "@id", value: id }],
          })
          .fetchAll();

        // const houseInfo = data.filter((info) => {
        //   //return info.city.toLowerCase().includes(city.toLowerCase());
        //   return info.id.toString() === id.toString();
        // });

        return {
          body: JSON.stringify(resources),
          headers: { "Content-Type": "application/json" },
        };
      }
    } catch (err) {
      return { status: 500, body: `Error: ${err.message} ` };
    }
  },
});
