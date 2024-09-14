const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    const query = event.queryStringParameters.q || 'Health';
    const apiKey = '9ba46422e55847098855c2995664151e'; // Your News API Key
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed fetching news data' })
        };
    }
};
