import React, { useState } from 'react';
    import { withauth } from '../../../lib/Withauth';
    import Box from '@mui/material/Box';
    import Card from '@mui/material/Card';
    import Grid from '@mui/material/Grid';
    import Button from '@mui/material/Button';
    import TextField from '@mui/material/TextField';
    import CardHeader from '@mui/material/CardHeader';
    import Typography from '@mui/material/Typography';
    import CardContent from '@mui/material/CardContent';
    import FormControl from '@mui/material/FormControl';
    import InputLabel from '@mui/material/InputLabel';
    import MenuItem from '@mui/material/MenuItem';
    import Select from '@mui/material/Select';
    import { styled } from '@mui/material/styles';
    import  Backdrop  from '@mui/material/Backdrop';
    import CircularProgress from '@mui/material/CircularProgress'
    import Aws from 'aws-sdk';
    import { ref as dbRef, set } from 'firebase/database';
    import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
    import { db, auth, storage,textdb } from '../../../firebase/firebase.config.js';
    import { v4 as uuidv4 } from 'uuid';
    import { addDoc, collection, setDoc ,doc} from 'firebase/firestore';

    Aws.config.update({
        accessKeyId:'AKIA2ZHUZR3ALSHCD6UD',
        secretAccessKey:'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',
        region:'us-east-1'
        });
    
    const polly = new Aws.Polly();
    
    const Createpodcast = () => {
        const StyledInput = styled('input')({
            display: 'none',
        });
    
        const categories = ["Web Development", "App Development", "College","Gym","Running"];
    
        const [values, setValues] = useState({
            title: '',
            description: '',
            category: '',
            prompt: '',
        });
        const [open,setopen]=useState(false);
    
        const [image, setImage] = useState(null);
        const [imagePreviewUrl, setImagePreviewUrl] = useState('');
        const [audio, setAudio] = useState(null); // State to hold audio URL
    
        const handleChange = (prop) => (event) => {
            setValues({ ...values, [prop]: event.target.value });
        };
    
        const handleImageChange = (event) => {
            const file = event.target.files[0];
            if (file) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreviewUrl(reader.result);
                };
                reader.readAsDataURL(file);
            }
        };
    
        const uploadFile = async (file, path) => {
            const storageReference = storageRef(storage, path);
            await uploadBytes(storageReference, file);

            return await getDownloadURL(storageReference);
        };
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                setopen(true);
                let imageUrl = '';
                let audioUrl = '';
                const podcastId = uuidv4(); // Generate a unique ID for the podcast
    
                if (image) {
                    imageUrl = await uploadFile(image, `images/${auth.currentUser.uid}/${podcastId}`);
                }
                
    
                if (audio) {
                    const audioBlob = await fetch(audio).then(r => r.blob());
                    audioUrl = await uploadFile(audioBlob, `audio/${auth.currentUser.uid}/${podcastId}.mp3`);
                }
    
                const podcastData = {
                    id: podcastId,
                    title: values.title,
                    description: values.description,
                    category: values.category,
                    prompt: values.prompt,
                    imageUrl,
                    audioUrl,
                    userId: auth.currentUser?.uid,
                    timestamp: Date.now()
                };
    
               const res= await setDoc(doc(textdb, 'podcasts', podcastId), podcastData);
              
            } catch (error) {
                console.error('Error uploading podcast:', error);
            }
            setopen(false);
            setValues({title:'',description:'',category:'',prompt:''});
            setImage(null);

            setAudio(null);
        };
        
        const generateVoice = () => {
            polly.synthesizeSpeech({
                Text: values.prompt,
                OutputFormat: 'mp3',
                VoiceId: 'Nicole'
            }, (error, data) => {
                if (error) {
                    console.error(error);
                } else {
                    const audioBuffer = data.AudioStream.buffer;
                    const audioUrl = URL.createObjectURL(new Blob([audioBuffer], { type: 'audio/mpeg' }));
                    setAudio(audioUrl);
                }
            });
        };
    
        return (
            <Box>
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={open}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Typography fontSize={26} fontWeight={1000}>Create Podcast</Typography>
                <Card>
                    <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }} />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={5}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Podcast Title'
                                        placeholder='ex : How Important Javascript is'
                                        value={values.title}
                                        onChange={handleChange('title')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={values.category}
                                            onChange={handleChange('category')}
                                            label="Category"
                                        >
                                            {categories.map((item, idx) => (
                                                <MenuItem key={idx} value={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Description'
                                        placeholder='Description of your podcast'
                                        multiline
                                        rows={4}
                                        value={values.description}
                                        onChange={handleChange('description')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='AI Prompt to generate podcast'
                                        placeholder='Ex : Each week on the Science Podcast, host Sarah Crespi delves into the latest scientific discoveries with researchers and news writers from around the globe.'
                                        multiline
                                        rows={4}
                                        value={values.prompt}
                                        onChange={handleChange('prompt')}
                                    />
                                    <Box marginTop={'20px'} height={'max-content'} display='flex' flexDirection='column' alignItems={'center'}>
                                        {audio && <audio controls autoPlay src={audio}></audio>} {/* Audio element */}
                                        <Button onClick={generateVoice} sx={{ marginBottom: '40px' }} variant='contained' size='large'>Generate</Button>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined">
                                        <StyledInput
                                            accept="image/*"
                                            id="file-input"
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            placeholder="Upload Image"
                                            onClick={() => document.getElementById('file-input').click()}
                                            InputProps={{
                                                endAdornment: (
                                                    <Button variant="contained" component="span" onClick={() => document.getElementById('file-input').click()}>
                                                        Browse
                                                    </Button>
                                                ),
                                            }}
                                        />
                                    </FormControl>
                                    {imagePreviewUrl && (
                                        <Box mt={2}>
                                            <img src={imagePreviewUrl} alt="Selected Image" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            gap: 5,
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Button type='submit' fullWidth variant='contained' size='large'>
                                            Upload your podcast
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        );
    };
    
    export default withauth(Createpodcast);
    