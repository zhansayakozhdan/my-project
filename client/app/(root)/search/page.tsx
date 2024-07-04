"use client"
import HackathonSearch from '@/components/shared/HackathonSearch';
import React from 'react';


const SearchPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Introduce yourself</h1>
                <HackathonSearch />
            </div>
        </div>
    );
};

export default SearchPage;











// import React, { useState } from 'react'
// import axios from 'axios'

// const Search = () => {
//     const [input, setInput] = useState('');
//     const [output, setOutput] = useState('');
//     const [endPoint, setEndpoint] = useState('openai')

//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         axios.post('http://localhost:5000/api/v1/embeddings/query-embedding', {query: input}).then((resp) => {
//             // setOutput(
//             //     // <p>
//             //     //     {res.data.response}
//             //     // </p>
//             // )
//         })
//     }
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default Search
