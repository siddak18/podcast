// ** React Imports
import React, { useState, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'

// ** Firebase Imports
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { textdb, auth } from '../../../firebase/firebase.config.js'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount = () => {
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png')
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    role: '',
    country: 'India',
    imgSrc: '/images/avatars/1.png'  // Initial default image
  })

  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => {
        setImgSrc(reader.result)
        setUserData(prevState => ({ ...prevState, imgSrc: reader.result }))  // Update userData with image src
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const userId = auth.currentUser.uid
      await setDoc(doc(textdb, 'users', userId), userData)
      console.log('User data updated successfully')
    } catch (error) {
      console.error('Error updating user data:', error)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = auth.currentUser.uid
        const docRef = doc(textdb, 'users', userId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const data = docSnap.data()
          setUserData(data)
          setImgSrc(data.imgSrc || '/images/avatars/1.png')  // Use the fetched imgSrc
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])
  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Username'
              name='username'
              value={userData.username}
              onChange={handleChange}
              placeholder='johnDoe'
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Name'
              name='name'
              value={userData.name}
              onChange={handleChange}
              placeholder='John Doe'
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                label='Country'
                name='country'
                value={userData.country}
                onChange={handleChange}
              >
                <MenuItem value='India'>India</MenuItem>
                {/* Add other countries if needed */}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
