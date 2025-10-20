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
        // for letting user know what filter is selected
        let selectedFilter = document.querySelector("#selected-filter");

        // loop for accessing the items
        itemsArray.forEach(item => {
            // reset everytime the loop restarts
            item.style.display = '';

            // storing the selected category
            let categoryToMatch = selectedCategory;

            const itemCategoryClass = item.className.split(' ')[1];

            // logic to hide or show
            if (categoryToMatch === 'All') {
                item.style.display = '';
                selectedFilter.innerHTML="";
            } else if (itemCategoryClass !== categoryToMatch) {
                // make the non selected item display none
                item.style.display = 'none';
                // making user see what filter is selected
                selectedFilter.innerHTML="";
                selectedFilter.append(`Filtering: ${categoryToMatch}`);
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