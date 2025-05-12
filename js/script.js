document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch tables
    function fetchTables() {
        const statusEl = document.getElementById('status');
        const tablesListEl = document.getElementById('tablesList');
        const tableCountEl = document.getElementById('tableCount');
        
        // Clear previous results
        tablesListEl.innerHTML = '';
        statusEl.className = 'loading';
        statusEl.textContent = 'Loading tables...';
        
        // Fetch data from API
        fetch('/api/v1/tables.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                
                // Display tables
                statusEl.className = 'success';
                statusEl.textContent = 'Tables loaded successfully!';
                
                // Extract table names from the response
                const tables = data.tables || [];
                
                if (tables.length === 0) {
                    tablesListEl.innerHTML = '<p>No tables found in the database.</p>';
                    tableCountEl.textContent = 'No tables found';
                } else {
                    tableCountEl.textContent = `Found ${tables.length} table${tables.length !== 1 ? 's' : ''}`;
                    
                    tables.forEach(tableObj => {
                        const li = document.createElement('li');
                        // Extract the actual table name from the object
                        // Looking for the first value in the object (e.g., Tables_in_ACMEPARKING property)
                        const tableName = Object.values(tableObj)[0];
                        li.textContent = tableName;
                        tablesListEl.appendChild(li);
                    });
                }
            })
            .catch(error => {
                statusEl.className = 'error';
                statusEl.textContent = `Error: ${error.message}`;
                console.error('Error fetching tables:', error);
            });
    }
    
    // Initial fetch
    fetchTables();
    
    // Add refresh button functionality
    document.getElementById('refresh').addEventListener('click', fetchTables);
});