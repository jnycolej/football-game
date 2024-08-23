import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import stream from 'stream';

//Define __filename and __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const csvFilePath = path.join(__dirname, '../data/LastLegGame.csv');    //Adjust the path to your CSV file
const outputFilePath = path.join(__dirname, '../data/output.json');

//Function to remove BOM from a string
function removeBOM(str) {
  if(str.charCodeAt(0) === 0xFEFF) {
    return str.slice(1);
  }
  return str;
}

/*export function generateDeck() {
  return new Promise((resolve, reject) => {
    const results = [];
    
    
    fs.createReadStream(csvFilePath, 'utf8')
      .on('data', (chunk) => {
        const cleanedChunk = removeBOM(chunk.toString());
        this.push(cleanedChunk);
      })
      .pipe(csv())
      .on('data', (data) => {
          results.push({
            description: data.description,
            penalty: data.penalty,
            points: parseInt(data.points, 10)
          });
      })
      .on('end', () => {
          resolve(results);
      })
      .on('error', (error) => {
          reject(error);
      });
    });
}*/

export function generateDeck() {
  return new Promise((resolve, reject) => {
    const results = [];

    //Reas the file and remove BOM if present
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
      if(err) {
        reject(err);
        return;
      }

      const cleanedContent = removeBOM(data);

      //Create a readable stream from the cleaned content
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(cleanedContent, 'utf8'))

      bufferStream 
        .pipe(csv())
        .on('data', (data) => {
          results.push({
            description: data.description.trim(),
            penalty: data.penalty.trim(),
            points: parseInt(data.points.trim(), 10)
          });
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  });
}