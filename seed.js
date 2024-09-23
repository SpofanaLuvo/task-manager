const { createTables, populateTables, dropTables } = require("./scripts.js");

(async function getStarted() {
  try {
    await dropTables();
    await createTables();
    console.log("DB content has been set. Let's gooo!");
  } catch (error) {
    console.error(error);
  }
})();
