import React from 'react'
import { IoLogoWhatsapp } from 'react-icons/io'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import { FcCancel } from 'react-icons/fc'
import classes from '../styles/ContactList.module.css'

const ContactList = ({ src, name, number, type, isWhatsapp, handleDelete }) => {
  return (
    <div className={classes.container}>
      <div className={classes.avatarContainer}>
        <div className={classes.avatar}>
          <img src={src} alt="img" />
        </div>
        <div className={classes.userName}>
          <p>{name}</p>
        </div>
      </div>

      <div className={classes.whatsapp}>
        <div className={classes.whatsappIcon}>
          <IoLogoWhatsapp size={24} />
        </div>
        <div className={classes.checkmark}>
          {isWhatsapp ? (
            <IoIosCheckmarkCircle size={18} />
          ) : (
            <FcCancel size={18} />
          )}
        </div>
      </div>

      <div className={classes.type}>
        <p>{type}</p>
      </div>

      <div className={classes.number}>
        <p>{number}</p>
      </div>

      <div className={classes.actions}>
        <div className={classes.edit}>
          <AiFillEdit size={24} />
        </div>
        <div onClick={handleDelete} className={classes.delete}>
          <MdDelete size={24} />
        </div>
      </div>
    </div>
  )
}

export default ContactList
