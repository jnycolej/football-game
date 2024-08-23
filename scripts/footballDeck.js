const fs = require("fs");
const readline = require("readline");

// specify the path of the CSV file
const path = "../data/LastLegGame.csv";
const jsonPath = "../data/output.json";

// Create a read stream
const readStream = fs.createReadStream(path);

// Create a readline interface
const readInterface = readline.createInterface({
    input: readStream
});

// Initialize an array to store the parsed data
const output = [];

// Event handler for reading lines
readInterface.on("line", (line) => {
  const row = line.split(",");
  output.push(row);
});

// Event handler for the end of file
readInterface.on("close", () => {
  console.log("CSV reading completed. Saving the data...");

  //Save the output array to a JSON file
  fs.writeFile(jsonPath, JSON.stringify(output, null, 2), (err) => {
    if(err){
        console.error("Error saving the data to JSON file:", err);
    } else {
        console.log(`Data saved to ${jsonPath}`);
    }
  });
});

// Event handler for handling errors
readInterface.on("error", (err) => {
  console.error("Error reading the CSV file:", err);
});