const pool = require("../database/")

async function getMessagesBySenderId(account_id) {
    try {
        const sql = `
        SELECT 
            m.message_subject,
            m.message_body,
            m.message_created,
            m.message_read,
            m.message_id,
            a.account_firstname,
            a.account_lastname,
            a.account_id
        FROM public.message m
        JOIN public.account a
            ON m.message_from = a.account_id
        WHERE m.message_to = $1 AND m.message_archive = false
        `

        
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error(error)

    }
    
}

async function getUserList() {
    try {
        const sql = "SELECT account_id, account_firstname, account_lastname FROM public.account"
        const data = await pool.query(sql)

        return data
    } catch (error) {
        console.error(error)

    }
    
}

async function postMessage(message_subject, message_body, message_to, message_from) {
    try {
        const sql = "INSERT INTO public.message (message_subject, message_body, message_to, message_from) VALUES ($1, $2, $3, $4) RETURNING *"
        const data = await pool.query(sql, [message_subject, message_body, message_to, message_from])

        return data

    } catch (error) {
        console.error(error)

    }
}

async function getMessageByMsgId(message_id) {

    try {
        const sql = `
        SELECT 
            m.message_subject,
            m.message_body,
            m.message_created,
            m.message_read,
            m.message_id,
            m.message_to,
            m.message_from,
            m.message_archive,
            a.account_firstname,
            a.account_lastname,
            a.account_id
        FROM public.message m
        JOIN public.account a
            ON m.message_from = a.account_id
        WHERE m.message_id = $1 
        `
        const data = await pool.query(sql, [message_id])

        console.log(data.rows[0])
        return data.rows[0]

    } catch (error) {
        console.error(error)

    }
}

async function updateMessageAsRead(msg_id) {
    try {
        const sql = `
            UPDATE public.message SET message_read = NOT message_read WHERE message_id = $1 RETURNING *
        
        `

        const data = await pool.query(sql, [msg_id])

        return data
    }catch (err) {
        console.error(err)
    }
    
}

async function updateArchive(msg_id) {
    try {
        const sql = `
            UPDATE public.message SET message_archive = NOT message_archive WHERE message_id = $1 RETURNING *
        
        `

        const data = await pool.query(sql, [msg_id])

        console.log(data)
        return data
    }catch (err) {
        console.error(err)
    }
    
}

async function deleteMessage(msg_id) {
    try {
        const sql = `
            DELETE FROM public.message WHERE message_id = $1 RETURNING *
        
        `

        const data = await pool.query(sql, [msg_id])

        return data
    }catch (err) {
        console.error(err)
    }
    
}

async function getArchivedMessages(account_id) {
    try {
        const sql = `
        SELECT 
            m.message_subject,
            m.message_body,
            m.message_created,
            m.message_read,
            m.message_id,
            a.account_firstname,
            a.account_lastname,
            a.account_id
        FROM public.message m
        JOIN public.account a
            ON m.message_from = a.account_id
        WHERE m.message_to = $1 AND m.message_archive = true
        `

        
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error(error)

    }
    
}


module.exports = {getMessagesBySenderId, getUserList, postMessage, getMessageByMsgId, updateMessageAsRead, updateArchive, deleteMessage, getArchivedMessages}

