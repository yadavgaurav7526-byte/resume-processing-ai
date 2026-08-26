import streamlit as st
from database import create_table, add_contact, get_contacts, delete_contact

st.set_page_config(page_title="SafeHer", page_icon="🛡️", layout="wide")
create_table()

# CSS

st.markdown("""
<style>

.block-container {
    padding-top: 2rem;
}

.hero {
    background: linear-gradient(135deg, #5b2a86, #9b4dcc);
    color: white;
    text-align: center;
    padding: 40px;
    border-radius: 25px;
    margin-bottom: 25px;
}

.hero-icon {
    font-size: 55px;
}

.hero-title {
    font-size: 40px;
    font-weight: bold;
}

.hero-text {
    font-size: 18px;
}

.card {
    background: white;
    padding: 22px;
    border-radius: 18px;
    border: 1px solid #eee;
    box-shadow: 0 4px 15px #00000012;
    margin-bottom: 10px;
}

.card-icon {
    font-size: 35px;
}

.card-title {
    font-size: 20px;
    font-weight: bold;
}

.card-text {
    color: #777;
}

.tip {
    background: #f3eff8;
    padding: 18px;
    border-radius: 15px;
    margin-top: 25px;
}


/* HOME FEATURE BUTTONS */

.stButton > button {
    min-height: 140px;
    text-align: left;
    padding: 25px;
    border-radius: 18px;
    border: 1px solid #eeeeee;
    background: white;
    font-size: 18px;
    font-weight: 600;
    box-shadow: 0 4px 15px #00000012;
    white-space: pre-wrap;
}

.stButton > button {
    transition: all 0.2s ease;
}

.stButton > button:hover {
    background: #8e44ad;
    color: white;
    border-color: #8e44ad;
    box-shadow: 0 0 20px #9b4dcc;
    transform: translateY(-3px);
}

.stButton > button:active {
    background: #6a1b9a;
    color: white;
    border-color: #6a1b9a;
    box-shadow: 0 0 35px #9b4dcc;
    transform: scale(0.97);
}


/* SIDEBAR */

section[data-testid="stSidebar"] {
    background: #faf7fc;
}

section[data-testid="stSidebar"] .stButton button {
    min-height: 45px;
    text-align: left;
    border: 0;
    background: transparent;
    padding: 12px 15px;
    box-shadow: none;
    font-size: 16px;
}

section[data-testid="stSidebar"] .stButton button:hover {
    background: #eadcf4;
}

</style>
""", unsafe_allow_html=True)

# Page
if "page" not in st.session_state:
    st.session_state.page = "🏠 Home"

page = st.session_state.page

# Sidebar
with st.sidebar:
    st.title("🛡️ SafeHer")
    st.write("Your personal safety companion")
    st.divider()

    pages = [
        ("🏠 Home", "🏠 Home"),
        ("🚨 Emergency SOS", "🚨 Emergency SOS"),
        ("📞 Emergency Contacts", "📞 Emergency Contacts"),
        ("📍 My Location", "📍 My Location"),
        ("📱 Fake Call", "📱 Fake Call"),
        ("⚠️ Report Area", "⚠️ Report Area")
    ]

    for text, value in pages:
        if st.button(text, use_container_width=True):
            st.session_state.page = value
            st.rerun()

# HOME
if page == "🏠 Home":

    st.markdown("""
    <div class="hero">
        <div class="hero-icon">🛡️</div>
        <div class="hero-title">You're not alone.</div>
        <div class="hero-text">
            SafeHer gives you quick access to safety tools
            when you feel unsafe.
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.subheader("🚨 Emergency")

    if st.button("🚨 ACTIVATE SOS", use_container_width=True):
        st.error("🚨 SOS ACTIVATED!")
        st.warning(
            "Prototype only. The final version will alert "
            "your emergency contacts with your location."
        )

    st.subheader("🛡️ Safety Tools")

    col1, col2 = st.columns(2)

    with col1:

        if st.button(
            "📞  Emergency Contacts\n\n"
            "People you trust.",
            key="contacts_card",
            use_container_width=True
        ):
            st.session_state.page = "📞 Emergency Contacts"
            st.rerun()

        if st.button(
            "📱  Fake Call\n\n"
            "Simulate an incoming call.",
            key="fake_call_card",
            use_container_width=True
        ):
            st.session_state.page = "📱 Fake Call"
            st.rerun()

    with col2:

        if st.button(
            "📍  My Location\n\n"
            "Check your current location.",
            key="location_card",
            use_container_width=True
        ):
            st.session_state.page = "📍 My Location"
            st.rerun()

        if st.button(
            "⚠️  Report Area\n\n"
            "Report an unsafe location.",
            key="report_card",
            use_container_width=True
        ):
            st.session_state.page = "⚠️ Report Area"
            st.rerun()

    st.markdown("""
    <div class="tip">
        💡 <b>Safety Tip</b><br>
        Keep your emergency contacts updated.
    </div>
    """, unsafe_allow_html=True)


# SOS
elif page == "🚨 Emergency SOS":

    st.title("🚨 Emergency SOS")
    st.warning("Use this feature only during an emergency.")

    if st.button("🚨 ACTIVATE SOS", use_container_width=True):
        st.error("🚨 SOS ACTIVATED!")
        st.info(
            "The final version will share your location "
            "with your trusted contacts."
        )

    st.subheader("How it will work")
    st.write("""
    1. Activate SOS.
    2. Get the user's location.
    3. Find emergency contacts.
    4. Prepare the emergency alert.
    5. Share the location with trusted contacts.
    """)


# CONTACTS
elif page == "📞 Emergency Contacts":

    st.title("📞 Emergency Contacts")
    st.write("Add people you trust.")

    name = st.text_input("Contact Name", placeholder="Mom")
    phone = st.text_input("Phone Number", placeholder="9876543210")

    if st.button("➕ Add Contact", use_container_width=True):
        if name.strip() and phone.strip():
            add_contact(name.strip(), phone.strip())
            st.success(f"✅ {name} added!")
            st.rerun()
        else:
            st.warning("Enter both name and phone number.")

    st.divider()
    st.subheader("👥 Saved Contacts")

    contacts = get_contacts()

    if not contacts:
        st.info("No emergency contacts yet.")

    for contact in contacts:
        contact_id, contact_name, contact_phone = contact

        col1, col2 = st.columns([5, 1])

        with col1:
            st.write(f"👤 **{contact_name}** — 📞 {contact_phone}")

        with col2:
            if st.button("🗑️", key=f"delete_{contact_id}"):
                delete_contact(contact_id)
                st.rerun()


# LOCATION
elif page == "📍 My Location":

    st.title("📍 My Location")
    st.write("Check your current location.")

    if st.button("📍 Get My Location", use_container_width=True):
        st.info("Location integration will be added next.")
        st.write("Future version: GPS coordinates + map.")


# FAKE CALL
elif page == "📱 Fake Call":

    st.title("📱 Fake Call")
    st.write("Simulate an incoming call.")

    caller = st.selectbox(
        "Choose caller",
        ["Mom", "Dad", "Best Friend", "Emergency Contact"]
    )

    if st.button("📞 Simulate Incoming Call", use_container_width=True):
        st.success(f"📞 Incoming Call\n\nCaller: {caller}")


# REPORT
elif page == "⚠️ Report Area":

    st.title("⚠️ Report an Unsafe Area")

    issue = st.selectbox(
        "Type of issue",
        ["Poor Lighting", "Harassment", "Stalking",
         "Unsafe Area", "Suspicious Activity", "Other"]
    )

    location = st.text_input("Location")
    description = st.text_area("Describe the issue")

    if st.button("⚠️ Submit Report", use_container_width=True):

        if location and description:
            st.success("✅ Report submitted!")
            st.write(f"**Issue:** {issue}")
            st.write(f"**Location:** {location}")
        else:
            st.warning("Please enter the location and description.")