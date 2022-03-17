import classes from '../styles/Home.module.css'
import { BiSearchAlt } from 'react-icons/bi'
import { RiImageAddFill } from 'react-icons/ri'
import { ImUpload } from 'react-icons/im'
import ContactList from '../components/ContactList'
import {
  Avatar,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  LinearProgress,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { makeStyles } from '@mui/styles'
import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/system'
import { useEffect, useState } from 'react'
import { storage } from '../firebase/firbase'
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'

//Overidding TextField and Select Styles
const useStyles = makeStyles({
  input: {
    color: '#fff',
    borderColor: '#fff',
  },

  select: {
    '&:before': {
      borderColor: 'white',
    },
    '&:after': {
      borderColor: 'white',
    },
    '&:not(.Mui-disabled):hover::before': {
      borderColor: 'white',
    },
  },
  icon: {
    fill: 'white',
  },
  root: {
    color: 'white',
  },
  underline: {
    borderColor: 'white',
    color: 'white',
  },
})

export default function Home() {
  //Creating custom theme for MUI
  let theme = createTheme({
    palette: {
      primary: {
        main: '#d1e8ff',
      },
      secondary: {
        main: '#1b41aa',
      },
    },
  })

  //assigning placeholders
  const [contactList, setContactList] = useState([])
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [type, setType] = useState('Personal')
  const [isWhatsapp, setIsWhatsapp] = useState(false)
  const [imgUrl, setImgUrl] = useState('')
  const [image, setImage] = useState('')
  const [isModal, setIsModal] = useState(false)
  const [progress, setProgress] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [preview, setPreview] = useState()

  const handleImgChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!image) return
    const storageRef = ref(storage, `/files/${image.name}`)
    const uploadTask = uploadBytesResumable(storageRef, image)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        )
        setProgress(prog)
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => setImgUrl(url))
      },
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    let contact = {
      id: new Date().getTime().toString(),
      name,
      number,
      type,
      isWhatsapp,
      imgUrl,
    }

    setContactList((currList) => [...currList, contact])
    setImage('')
    setImgUrl('')
    setName('')
    setNumber('')
    setIsWhatsapp('')
    setProgress(false)
    setLoading(false)
    setType('Personal')
  }

  const handleCancel = () => {
    setImage('')
    setImgUrl('')
    setName('')
    setNumber('')
    setIsWhatsapp('')
    setProgress(false)

    setType('Personal')
    setIsModal(false)
  }

  //getting contactList back from localStorage
  useEffect(() => {
    const data = localStorage.getItem('contactList')
    if (data) {
      setContactList(JSON.parse(data))
    } else {
      setContactList([])
    }
  }, [])

  //svaing data on useStorage
  useEffect(() => {
    localStorage.setItem('contactList', JSON.stringify(contactList))
  }, [contactList])

  const handleDelete = (id) => {
    const removeItem = contactList.filter((el) => el.id !== id)
    setContactList(removeItem)
  }

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!image) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(image)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [image])

  const styles = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>
        <h1>Contact List</h1>
        <div className={classes.addContactContainer}>
          <div
            onClick={() => setIsModal(true)}
            className={classes.addContactButton}
          >
            <span>ADD CONTACT</span>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <BiSearchAlt />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={classes.contactList}>
          {contactList.length < 1 ? (
            <div>
              <h1> No Contacts to see </h1>
            </div>
          ) : (
            contactList
              .sort((a, b) => a.name.localeCompare(b.name))
              .filter((el) => {
                if (searchTerm === '') {
                  return el
                } else if (
                  el.name.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return el
                }
              })
              .map((contact) => {
                return (
                  <ContactList
                    key={contact.id}
                    src={contact.imgUrl}
                    name={contact.name}
                    isWhatsapp={contact.isWhatsapp}
                    number={contact.number}
                    type={contact.type}
                    handleDelete={() => handleDelete(contact.id)}
                  />
                )
              })
          )}
        </div>

        {/* Code splitting can be done. For the time being keeping it included */}
        {isModal ? (
          <div className={classes.addAddressModal}>
            <div className={classes.addAdressContainer}>
              <h1>ADD CONTACT</h1>
              <div className={classes.AvatarContainer}>
                <Avatar
                  src={imgUrl ? imgUrl : preview ? preview : null}
                  sx={{ width: 100, height: 100 }}
                />
                {progress ? (
                  <div className={classes.progressBar}>
                    <LinearProgress
                      style={{ flex: 1 }}
                      variant="determinate"
                      color="secondary"
                      value={progress}
                    />
                    <p>{progress}%</p>
                  </div>
                ) : null}
              </div>

              <div className={classes.formContainer}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                  <div className={classes.avatarContainer}>
                    <div className={classes.buttonWrap}>
                      <div className={classes.chooseImg}>
                        <div>
                          <input
                            type="file"
                            name="img"
                            id="img"
                            hidden
                            defaultValue={image}
                            onChange={handleImgChange}
                          />
                          <label
                            style={{ display: 'flex', alignItems: 'center' }}
                            htmlFor="img"
                          >
                            <RiImageAddFill size={25} />
                            <p>Choose an Image</p>
                          </label>
                        </div>
                      </div>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={handleUpload}
                        className={classes.uploadImg}
                      >
                        <ImUpload size={25} />
                        <p>Upload Image</p>
                      </div>
                    </div>
                  </div>
                  <TextField
                    inputProps={{
                      className: styles.input,
                    }}
                    id=""
                    label="Enter Your Name"
                    color="primary"
                    fullWidth
                    margin="dense"
                    variant="standard"
                    style={{ marginTop: '2rem' }}
                    focused
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    inputProps={{
                      className: styles.input,
                    }}
                    id=""
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    label="Enter Number"
                    color="primary"
                    fullWidth
                    margin="dense"
                    variant="standard"
                    style={{ marginTop: '1rem' }}
                    focused
                  />
                  <div className={classes.inputGroup}>
                    <FormControlLabel
                      label="Whatsapp"
                      control={
                        <Checkbox
                          checked={isWhatsapp}
                          onChange={(e) => setIsWhatsapp(e.target.checked)}
                          color="primary"
                        />
                      }
                    />
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel style={{ color: 'white' }}>Type</InputLabel>
                      <Select
                        label="Type"
                        variant="standard"
                        inputProps={{
                          classes: {
                            icon: styles.icon,
                            root: styles.root,
                            underline: styles.underline,
                          },
                        }}
                        style={{ color: 'white' }}
                        color="primary"
                        focused
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        sx={{
                          ':before': { borderBottomColor: '#d1e8ff' },
                          ':after': { borderBottomColor: '#d1e8ff' },
                        }}
                      >
                        <MenuItem value={'Personal'}>Home</MenuItem>
                        <MenuItem value={'Office'}>Personal</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className={classes.buttonWrap}>
                    <div onClick={handleSubmit} className={classes.submit}>
                      <p>Save</p>
                    </div>
                    <div onClick={handleCancel} className={classes.cancel}>
                      <p>Cancel</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </ThemeProvider>
  )
}
