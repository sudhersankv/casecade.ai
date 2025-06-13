import streamlit as st
import json
from timeline_extractor import TimelineExtractor
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="Legal Timeline Generator", layout="wide")

st.title("🏛️ Legal Timeline Generator")
st.write("Advanced AI-powered timeline extraction for legal documents using temporal reasoning")

# Initialize the timeline extractor
@st.cache_resource
def get_timeline_extractor():
    return TimelineExtractor()

extractor = get_timeline_extractor()

# Sidebar for configuration
st.sidebar.header("Configuration")
show_metadata = st.sidebar.checkbox("Show Metadata", value=True)
show_temporal_relations = st.sidebar.checkbox("Show Temporal Relations", value=True)
show_raw_json = st.sidebar.checkbox("Show Raw JSON", value=False)

# Main interface
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("Input Legal Document")
    text_input = st.text_area("Enter legal text:", height=300, placeholder="Paste your legal document here...")

with col2:
    st.subheader("Quick Actions")
    if st.button("🔍 Generate Timeline", type="primary"):
        if text_input:
            with st.spinner("🔄 Analyzing document and generating timeline..."):
                # Process the document
                timeline_data = extractor.process_document(text_input)
                
                # Store in session state
                st.session_state.timeline_data = timeline_data
        else:
            st.warning("⚠️ Please enter some text to analyze.")

# Display results if available
if 'timeline_data' in st.session_state:
    timeline_data = st.session_state.timeline_data
    
    # Display metadata
    if show_metadata:
        st.subheader("📊 Timeline Metadata")
        metadata = timeline_data['metadata']
        
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Total Events", metadata['total_events'])
        with col2:
            st.metric("Explicit Events", metadata['explicit_events'])
        with col3:
            st.metric("Implicit Events", metadata['implicit_events'])
        with col4:
            st.metric("Dated Events", metadata['dated_events'])
    
    # Display timeline
    st.subheader("📅 Timeline of Events")
    
    # Combine dated and undated events for display
    all_events = timeline_data['timeline']['dated_events'] + timeline_data['timeline']['undated_events']
    
    if all_events:
        # Create DataFrame for display
        df_data = []
        for event in all_events:
            df_data.append({
                'Date': event.get('date', 'Inferred'),
                'Description': event.get('description', ''),
                'Type': event.get('type', ''),
                'Event Type': event.get('event_type', ''),
                'Importance': event.get('importance', ''),
                'Parties': ', '.join(event.get('parties', [])),
                'Trigger': event.get('trigger', '')
            })
        
        df = pd.DataFrame(df_data)
        
        # Style the dataframe
        def highlight_importance(row):
            importance = row['Importance'].lower()
            if importance == 'critical':
                return ['background-color: #ffcdd2'] * len(row)
            elif importance == 'high':
                return ['background-color: #fff9c4'] * len(row)
            elif importance == 'medium':
                return ['background-color: #e8f5e9'] * len(row)
            return [''] * len(row)
        
        # Display styled dataframe
        st.dataframe(
            df.style.apply(highlight_importance, axis=1),
            use_container_width=True,
            height=400
        )
        
        # Display temporal relations
        if show_temporal_relations:
            st.subheader("🔗 Temporal Relations")
            
            for event in all_events:
                if event.get('temporal_relations'):
                    with st.expander(f"Relations for: {event['description']}"):
                        for relation in event['temporal_relations']:
                            col1, col2, col3 = st.columns([2, 1, 1])
                            with col1:
                                st.write(f"**{relation['related_event']}**")
                            with col2:
                                st.write(f"Relation: {relation['relation']}")
                            with col3:
                                st.write(f"Days: {relation['days_difference']}")
        
        # Display summary
        st.subheader("📋 Summary")
        summary = timeline_data['summary']
        
        col1, col2 = st.columns(2)
        with col1:
            st.write("**Key Events:**")
            for event in summary['key_events']:
                st.write(f"• {event['description']} ({event.get('date', 'Inferred')})")
        
        with col2:
            st.write("**Event Types:**")
            for event_type in summary['event_types']:
                st.write(f"• {event_type.title()}")
            
            st.write("**Parties Involved:**")
            for party in summary['parties_involved']:
                st.write(f"• {party}")
        
        # Display raw JSON if requested
        if show_raw_json:
            st.subheader("🔧 Raw Timeline Data")
            st.json(timeline_data)
    
    else:
        st.warning("⚠️ No events could be extracted from the text.")

# Example section
with st.expander("📖 Example Legal Text"):
    example_text = """
    On January 15, 2024, the plaintiff John Smith filed a complaint against XYZ Corporation alleging workplace harassment and wrongful termination. The complaint was served on the defendant on January 20, 2024.

    A preliminary hearing was scheduled for February 1, 2024, before Judge Williams. During the hearing, the judge ordered both parties to submit additional documentation within 30 days.

    The defendant filed their response on February 15, 2024, denying all allegations and requesting dismissal of the case. The plaintiff's attorney submitted additional evidence on March 1, 2024, including witness statements and employment records.

    A settlement conference was held on March 15, 2024, but no agreement was reached. The court ordered mediation on April 1, 2024, with a neutral mediator appointed by the court.

    The mediation session was conducted on April 15, 2024, lasting 8 hours. Following successful mediation, the case was settled on May 1, 2024, with terms remaining confidential per the settlement agreement.
    """
    
    st.text_area("Sample legal document:", value=example_text, height=200, disabled=True)
    
    if st.button("📝 Use Example Text"):
        st.session_state.example_text = example_text
        st.rerun()

# Load example text if requested
if 'example_text' in st.session_state:
    text_input = st.session_state.example_text
    del st.session_state.example_text

# Footer
st.markdown("---")
st.markdown("*Built with advanced temporal reasoning based on LexTime research methodology*") 
