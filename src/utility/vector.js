// Function to calculate cosine similarity
function cosineSimilarity(embedding1, embedding2) {
    const dotProduct = embedding1.reduce((sum, val, index) => sum + val * embedding2[index], 0);
    const magnitude1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
    const magnitude2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitude1 * magnitude2);
}


export default function rankEmbeddings(targetEmbedding, embeddings) {
    console.log(embeddings)
    return Object.entries(embeddings)
        .map(([fileName, {embedding}]) => {
            return {
                fileName,
                similarity: cosineSimilarity(targetEmbedding, embedding)
            }
        })
        .sort((a, b) => b.similarity - a.similarity); // Sort in descending order of similarity
}