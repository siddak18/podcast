// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// ** Firebase Imports
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { textdb, auth } from '../../../firebase/firebase.config.js'

const TabInfo = () => {
  // ** State
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [country, setCountry] = useState('USA')
  const [gender, setGender] = useState('male')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // ** Snackbar Functions
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }

  // ** Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid
        const docRef = doc(textdb, 'users', userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const userData = docSnap.data()
          setBio(userData.bio || '')
          setPhone(userData.phone || '')
          setWebsite(userData.website || '')
          setCountry(userData.country || 'USA')
          setGender(userData.gender || 'male')
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userId = auth.currentUser.uid
      const userData = {
        bio,
        phone,
        website,
        country,
        gender
      }
      await setDoc(doc(textdb, 'users', userId), userData)
      console.log('User data updated successfully')
      setSnackbarOpen(true) // Show success message
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField
              fullWidth
              multiline
              label='Bio'
              minRows={2}
              placeholder='Bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Phone'
              placeholder='(123) 456-7890'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Website'
              placeholder='https://example.com/'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                label='Country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <MenuItem value='USA'>USA</MenuItem>
                <MenuItem value='UK'>UK</MenuItem>
                <MenuItem value='Australia'>Australia</MenuItem>
                <MenuItem value='Germany'>Germany</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel sx={{ fontSize: '0.875rem' }}>Gender</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                aria-label='gender'
                name='account-settings-info-radio'
              >
                <FormControlLabel value='male' label='Male' control={<Radio />} />
                <FormControlLabel value='female' label='Female' control={<Radio />} />
                <FormControlLabel value='other' label='Other' control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} type='submit'>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar for showing success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity='success' sx={{ width: '100%' }}>
          User data saved successfully!
        </Alert>
      </Snackbar>
    </CardContent>
  )
}

export default TabInfo
