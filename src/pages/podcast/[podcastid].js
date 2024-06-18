"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { textdb } from '../../../firebase/firebase.config.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PodcastDetail = () => {
  const router = useRouter();
  const { podcastid } = router.query;

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPodcast = async () => {
      if (podcastid) {
        try {
          const docRef = doc(textdb, "podcasts", podcastid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setPodcast(docSnap.data());
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching podcast:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPodcast();
  }, [podcastid]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!podcast) {
    return <Typography variant="h6" color="error">Podcast not found</Typography>;
  }

  return (
    <Container>
      <Card sx={{ marginTop: '20px' }}>
        {podcast.imageUrl && (
          <CardMedia
            component="img"
            height="300"
            image={podcast.imageUrl}
            alt={podcast.title}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            {podcast.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {podcast.description.length > 50 ? `${podcast.description.split(" ").slice(0, 50).join(" ")}...` : podcast.description}
          </Typography>
          <Box sx={{ marginTop: '20px' }}>
            <Typography variant="h6">Prompt:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {podcast.prompt}
            </Typography>
          </Box>
          {podcast.audioUrl && (
            <Box sx={{ marginTop: '20px' }}>
              <Typography variant="h6">Listen:</Typography>
              <audio controls src={podcast.audioUrl} style={{ width: '100%' }} />
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: '20px' }}>
            Category: {podcast.category}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PodcastDetail;
