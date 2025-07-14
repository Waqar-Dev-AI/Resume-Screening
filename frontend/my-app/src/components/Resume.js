// import axios from 'axios';
// import React, { useState } from 'react';

// const Resume = () => {
//     const[file ,setfile]=useState(null);
//     const[job_description,setjob_description]=useState(null);
//     const[bert_scroll,setbert_scroll]=useState(0);
//     const[tfidf_scroll,settfidf_scroll]=useState(0);
//     const[loaded,setloaded]=useState(false);

//     const handleFileChange = (e) => { 
//         setfile(e.target.files[0]);
//     }
//     const handlesubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append("job_description",job_description);
//         setloaded(true);
//         try{
//         const tfidf=await axios.post('http://127.0.0.1:8000/resume_tfidf/', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         console.log("TF-IDF Response:", tfidf.data);


//         const bert=await axios.post('http://127.0.0.1:8000/resume_bert/', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//             settfidf_scroll(tfidf.data.tfmatch_percentage);
//             setbert_scroll(bert.data.bertmatch_percentage);
//         }
//         catch(error){
//             console.log(error);
//         }
//         finally{
//             setloaded(false);}
//     }


//     return (
//         <div>
//             <h1>My Resume</h1>
//             <p>This is a brief description of my resume.</p>
//             <form onSubmit={handlesubmit}>
//                 <input type="file" onChange={handleFileChange} />
//                 <input type="text" onChange={(e) => setjob_description(e.target.value)} />
//                 <button type="submit" disabled={loaded}>{loaded? "pppp":"match"}</button>
//             </form>
//             {loaded && <p>Loading...</p>}
//             <div>
//                 <h2>Results</h2>
//                 <p>BERT Match Percentage: {bert_scroll}%</p>
//                 <p>TF-IDF Match Percentage: {tfidf_scroll}%</p>
//             </div>
//         </div>
//     );
// };

// export default Resume;




import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, CircularProgress, Box } from '@mui/material';

const Resume = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [bertScore, setBertScore] = useState(0);
    const [tfidfScore, setTfidfScore] = useState(0);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDescription);
        setLoading(true);

        try {
            const [tfidf, bert] = await Promise.all([
                axios.post('http://127.0.0.1:8000/resume_tfidf/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }),
                axios.post('http://127.0.0.1:8000/resume_bert/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
            ]);

            //
            // 
             console.log("TF-IDF Response:", tfidf.data);
            //  console.log("BERT Response:", bert.data);

            setTfidfScore(tfidf.data.tfmatch_percentage);
            setBertScore(bert.data.bertmatch_percentage);
            setSkills(tfidf.data.extracted_info.skills);
            setUserInfo(tfidf.data.extracted_info);
        } catch (error) {
            console.error("Error in API:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: 'white' }}>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>Resume Matcher</Typography>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>Upload your resume and compare it with a job description.</Typography>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
                <TextField
                    label="Enter Job Description"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Match Resume"}
                </Button>
            </form>

            {loading && <Typography variant="body2" sx={{ mt: 2, textAlign: 'center', color: 'gray' }}>Processing...</Typography>}

            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Job Description</Typography>
            <p>{jobDescription}</p>

            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Resume Information</Typography>
            {/* <h2>Name: {userInfo.name}</h2> */}
                    <p>Email: {userInfo.email}</p>
                    <p>Mobile: {userInfo.mobile_number}</p>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Resume Skills</Typography>
               <p>Skills: {userInfo.skills.join(", ")}</p> 
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Match Results</Typography>
                <Typography variant="body1" color="primary">BERT Match: {bertScore}%</Typography>
                <Typography variant="body1" color="secondary">TF-IDF Match: {tfidfScore}%</Typography>
            </Box>
        </Container>
    );
};

export default Resume;
