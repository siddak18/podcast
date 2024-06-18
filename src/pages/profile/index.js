// pages/profile.js

import { useEffect, useState } from 'react'
import { withauth } from '../../../lib/Withauth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, textdb } from '../../../firebase/firebase.config'
import { Box, Container, Typography } from '@mui/material'

const Profile = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid
        const docRef = doc(textdb, 'users', userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUserData(docSnap.data())
        } else {
          setError('No user data found')
        }
      } catch (error) {
        setError('Error fetching user data')
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
          {userData.imgSrc && (
            <img src={userData.imgSrc} alt="Profile Pic" style={{ width: 120, height: 120, borderRadius: '50%', marginRight: { xs: 0, md: 20 } }} />
          )}
          <Box>
            <Typography variant="h4" gutterBottom>
              {userData.username}
            </Typography>
            <Typography variant="body1">Name: {userData.name}</Typography>
            <Typography variant="body1">Email: {userData.email}</Typography>
            <Typography variant="body1">Bio: {userData.bio}</Typography>
            <Typography variant="body1">Phone: {userData.phone}</Typography>
            <Typography variant="body1">Website: {userData.website}</Typography>
            <Typography variant="body1">Country: {userData.country}</Typography>
            <Typography variant="body1">Gender: {userData.gender}</Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default withauth(Profile)
