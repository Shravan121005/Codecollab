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
};

export default styles;

