import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="VIT Power Grid Dashboard",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Strip default padding to let the flowchart take over
st.markdown("""
<style>
    .stApp {
        background-color: #050505;
        background-image: radial-gradient(circle at 50% 0%, #171d36 0%, #050505 60%);
        color: #ffffff;
    }
    /* Remove padding around the iframe for a seamless look */
    .block-container {
        padding-top: 0rem !important;
        padding-left: 0rem !important;
        padding-right: 0rem !important;
        padding-bottom: 0rem !important;
        max-width: 100% !important;
    }
    iframe {
        border: none;
    }
</style>
""", unsafe_allow_html=True)

# Embed the exact React/Vite instance directly into Streamlit
components.iframe("https://vit-power-demo.vercel.app/", height=1000, scrolling=True)
