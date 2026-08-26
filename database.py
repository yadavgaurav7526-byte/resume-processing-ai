import sqlite3

# Create/connect to the database
def connect_db():
    return sqlite3.connect("safeher.db")


# Create the contacts table
def create_table():

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Add a contact
def add_contact(name, phone):

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO contacts (name, phone) VALUES (?, ?)",
        (name, phone)
    )

    conn.commit()
    conn.close()


# Get all contacts
def get_contacts():

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM contacts")

    contacts = cursor.fetchall()

    conn.close()

    return contacts


# Delete a contact
def delete_contact(contact_id):

    conn = connect_db()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM contacts WHERE id = ?",
        (contact_id,)
    )

    conn.commit()
    conn.close()