document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector(".dropdown-content");
    const links = document.querySelectorAll(".category-link");

    function filterTransactions(selectedCategory) {
        // getting the expense list
        const transactionList = document.querySelector("#expense-list");
        // ternary operator to avoid a 'null' element, if it is, then return a empty array
        const transactionItems = transactionList ? transactionList.querySelectorAll('li') : [];
        // array of items
        const itemsArray = Array.from(transactionItems);

        // loop for accessing the items
        itemsArray.forEach(item => {
            // reset everytime the loop restarts
            item.style.display = '';

            // mapping the differences between names
            let categoryToMatch = selectedCategory;

            // correction for restaurant and food name differences
            if (selectedCategory === 'food') {
                categoryToMatch = 'restaurant';
            }

            const itemCategoryClass = item.className.split(' ')[1];

            // logic to hide or show
            if (categoryToMatch === 'all') {
                item.style.display = '';
            } else if (itemCategoryClass !== categoryToMatch) {
                // make the non selected item display none
                item.style.display = 'none';
            }
        });

        // close the dropdown after click
        if (content) {
            content.classList.remove('show');
        }
    }

    // logic for clicking and then applying the function forr filtering
    links.forEach(link => {
        link.addEventListener('click', (event) => {
            // preventing from reload page
            event.preventDefault();
            // getting the 'href' attribute without #
            const selectedCategory = link.getAttribute('href').substring(1);
            // call the function for filtering
            filterTransactions(selectedCategory);
        });
    });
});