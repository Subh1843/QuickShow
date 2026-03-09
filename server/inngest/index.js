import { Inngest } from "inngest";
import User from "../models/User.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// Inngest function to save user data to a database
//user data clerk se milega jab bhi koi naya user create hoga toh clerk ek event emit karega jiska naam hoga 'clerk/user.created' aur us event ke andar user ka data hoga, hum us event ko listen karenge aur jab bhi wo event aayega tab hum us user data ko apne database mein save kar denge.
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk' },
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        // Yahan pe aap apne database mein user data save kar sakte ho.
        const userData = {
            _id: id,
            name: first_name + ' ' +last_name,
            email: email_addresses[0].email_address,
            image: image_url
        };
        await User.create(userData);
    }
)

// Inngest function to delete user data from database when user is deleted from clerk
const syncUserDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk' },
    {event: 'clerk/user.deleted'},
    async ({ event }) => {
        const { id } = event.data;
        // Yahan pe aap apne database se user data delete kar sakte ho.
        await User.findByIdAndDelete(id);
    }
);

// Agar aap future mein aur bhi Inngest functions create karte ho toh unhe bhi is array ke andar export kar dena taki wo server.js mein import ho sake.

// Inngest function to update user data in database when user is updated in clerk

const syncUserUpdation = inngest.createFunction(
    {id: 'update-user-from-clerk' },
    {event: 'clerk/user.updated'},
    async ({ event }) => {
        const { id, first_name, last_name, email_address, image_url } = event.data;
        // Yahan pe aap apne database mein user data update kar sakte ho.
        const userData = {
            _id: id,
            name: first_name + ' ' +last_name,
            email: email_address[0].email_address,
            image: image_url
        };
        await User.findByIdAndUpdate(id, userData);
    }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];