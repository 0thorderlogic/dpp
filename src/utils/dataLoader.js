import Papa from 'papaparse';

export const loadCSVData = async (filePath) => {
    try {
        const response = await fetch(filePath);
        const csvString = await response.text();
        return new Promise((resolve, reject) => {
            Papa.parse(csvString, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    resolve(results.data);
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error(`Error loading CSV from ${filePath}:`, error);
        return [];
    }
};
