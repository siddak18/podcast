"use client";
import React, { useEffect, useState } from 'react';
import { withauth } from '../../../lib/Withauth';
import { textdb, auth } from '../../../firebase/firebase.config.js';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import Link from 'next/link'
import { Delete, Details, Update } from '@mui/icons-material';

const categories = ["Web Development", "App Development", "College", "Gym", "Running"];

const Discover = () => {

  const [podcasts, setPodcasts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPodcast, setCurrentPodcast] = useState(null);

  const [updatedValues, setUpdatedValues] = useState({
    title: '',
    description: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {

    const fetchPodcasts = async () => {
      try {
        const querySnapshot = await getDocs(collection(textdb, "podcasts"));

        const podcastsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
       console.log(podcastsList[0]);
        setPodcasts(podcastsList);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }

    };

    fetchPodcasts();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(textdb, "podcasts", id));
      setPodcasts(podcasts.filter(podcast => podcast.id !== id));
      console.log("Podcast deleted successfully");
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  const handleOpenUpdate = (podcast) => {
    setCurrentPodcast(podcast);
    setUpdatedValues({ title: podcast.title, description: podcast.description });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const podcastRef = doc(textdb, "podcasts", currentPodcast.id);
      await updateDoc(podcastRef, updatedValues);
      setPodcasts(podcasts.map(podcast =>
        podcast.id === currentPodcast.id ? { ...podcast, ...updatedValues } : podcast
      ));
      setOpen(false);
      console.log("Podcast updated successfully");
    } catch (error) {
      console.error("Error updating podcast:", error);
    }
  };

  const handleChange = (prop) => (event) => {
    setUpdatedValues({ ...updatedValues, [prop]: event.target.value });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredPodcasts = selectedCategory
    ? podcasts.filter(podcast => podcast.category === selectedCategory)
    : podcasts;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Discover Podcasts
      </Typography>
      <Box display="flex" alignItems="center" marginBottom="20px">
        <FormControl fullWidth variant="outlined">
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Filter by Category"
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {categories.map((category, idx) => (
             <MenuItem key={idx} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <IconButton aria-label="filter" color="primary">
          <FilterListIcon />
        </IconButton>
      </Box>
      <Grid container spacing={4}>
        {filteredPodcasts.length > 0 ? (
          filteredPodcasts.map(podcast => (
         <Grid item xs={12} sm={6} md={4} key={podcast.id}>
              <Card sx={{cursor:'pointer',height:'100%'}} >
                {podcast.imageUrl && (
                  
                  <CardMedia
                    component="img"
                    height="140"
                    image={podcast.imageUrl}
                    alt={podcast.title}
                  />
                )}
                 <Link passHref href={`podcast/${podcast.id}` }>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {podcast.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {
                    podcast.description
                    }
                  </Typography>
                </CardContent>
                </Link>
                <CardActions sx={{display:'flex',flexDirection:'column'}}>
                  {podcast.audioUrl && (
                    <audio controls src={podcast.audioUrl} style={{ width: '100%' }}></audio>
                  )}
                  {podcast.userId === auth.currentUser?.uid && (
                    <Box sx={{width:'100%',display:'flex',justifyContent:'space-between',marginTop:'20px'}}>
                      <Button size="small" color="secondary" onClick={() => handleDelete(podcast.id)}>
                        <Delete></Delete>
                      </Button>
                      <Button size="small" color="primary" onClick={() => handleOpenUpdate(podcast)}>
                        <Update></Update>
                      </Button>
                      <Link passHref href={`podcast/${podcast.id}`}>
                      <Details></Details>
                      </Link>
                    </Box>
                  )}
                </CardActions>
              </Card>
              
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No podcasts found.</Typography>
        )}
      </Grid>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ ...style, width: 400 }}>
          <Typography variant="h6" component="h2">
            Update Podcast
          </Typography>
          <TextField
            fullWidth
            label='Podcast Title'
            placeholder='Podcast Title'
            value={updatedValues.title}
            onChange={handleChange('title')}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label='Description'
            placeholder='Description'
            multiline
            rows={4}
            value={updatedValues.description}
            onChange={handleChange('description')}
            sx={{ mt: 2 }}
          />
          <Button onClick={handleUpdate} variant='contained' size='large' sx={{ mt: 2 }}>
            Update
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default withauth(Discover);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
