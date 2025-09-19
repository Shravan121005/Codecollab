// Merged styles: Restored auth/nav with the improved dashboard layout.

const styles = {
    // --- General & Auth/Nav Styles (Kept as requested) ---
    container: {
        fontFamily: 'sans-serif',
        maxWidth: '960px',
        margin: 'auto',
        padding: '20px'
    },
    nav: {
        backgroundColor: '#333',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    navLink: {
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
        fontWeight: 'bold'
    },
    navButton: {
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
        fontWeight: 'bold',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem'
    },
    formContainer: {
        backgroundColor: '#f4f4f4',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    formTitle: {
        borderBottom: '2px solid #ddd',
        paddingBottom: '10px',
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    button: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: 'white',
        cursor: 'pointer',
        fontSize: '16px'
    },
    error: {
        color: 'red',
        marginBottom: '10px'
    },

    // --- Improved Dashboard Styles ---
    dashboardTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '1rem',
    },
    dashboardSubtitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#34495e',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '0.5rem',
    },
    dashboardCard: {
        backgroundColor: '#f4f4f4',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
    },
    projectList: {
        listStyle: 'none',
        padding: 0
    },
    projectItem: {
        backgroundColor: '#fff',
        padding: '1rem 1.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectName: {
        margin: 0,
        fontWeight: '600',
        fontSize: '1.1rem',
    },
    projectDate: {
        margin: '4px 0 0',
        fontSize: '0.9rem',
        color: '#7f8c8d',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
    },

    // Editor Page
    editorLayout: {
        display: 'flex',
        // This height calculation is crucial for Monaco Editor to work.
        // It subtracts the approximate height of the navbar and margins from the viewport height.
        height: 'calc(100vh - 120px)',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden', // Prevents content from spilling out
    },
    fileList: {
        width: '200px',
        borderRight: '1px solid #ddd',
        padding: '10px',
        backgroundColor: '#fdfdfd',
        overflowY: 'auto',
    },
    fileItem: {
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
    },
    activeFile: {
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '4px',
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
    editorContainer: {
        flex: 1, // This makes the editor take up the remaining space.
        height: '100%', // This forces the editor container to fill its parent's height.
    },
    addFileButton: { // New style for the "Add File" button
        width: '100%',
        padding: '8px',
        marginBottom: '10px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
    },
    // New styles for the add file input form
    addFileForm: {
        display: 'flex',
        marginBottom: '10px',
    },
    addFileInput: {
        flex: 1,
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px 0 0 4px',
        boxSizing: 'border-box'
    },
    addFileSubmit: {
        padding: '8px 10px',
        border: '1px solid #27ae60',
        backgroundColor: '#27ae60',
        color: 'white',
        borderRadius: '0 4px 4px 0',
        cursor: 'pointer',
    },
};

export default styles;

