import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.join('db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    console.error('Error reading contacts file:', error);
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts.find(contact => contact.id === contactId) || null;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const deletedContact = contacts.find(contact => contact.id === contactId);
    if (!deletedContact) {
      return null;
    }
    const updatedContacts = contacts.filter(contact => contact.id !== deletedContact.id);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return deletedContact;
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContact = { id: nanoid(), name, email, phone };
    console.log('New Contact:', newContact); // Log newContact object
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updateContactById(id, newData) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const indexToUpdate = contacts.findIndex((contact) => contact.id === id);
    
    if (indexToUpdate === -1) {
      return { message: 'Not found' };
    }
    
    const updatedContact = { ...contacts[indexToUpdate], ...newData };
    contacts[indexToUpdate] = updatedContact;
    
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    
    return updatedContact;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default { listContacts, getContactById, removeContact, addContact, updateContactById };
