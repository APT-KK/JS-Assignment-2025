let items = [], categories = [];
let currentPage = 1;
let itemsPerPage = 10;

const fetchData = async () => {
    try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
            fetch('http://43.205.110.71:8000/items'),
            fetch('http://43.205.110.71:8000/categories'),
        ]);

        if (!itemsResponse.ok || !categoriesResponse.ok) {
            throw new Error('Network response was not ok');
        }

        items = await itemsResponse.json();
        categories = await categoriesResponse.json();
        console.log('Items:', items);
        console.log('Categories:', categories);

        // making an array to store all the tags
        let allTags = [];

        items.forEach(item => {
        (item.tags || '').split('|').forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }   
        });
        });

        displayItems(items);
        fillCategories(categories);
        fillTags(allTags);

        //event listeners for cat and tag dropdown 
        document.getElementById('category-select').addEventListener('change', () => {
            currentPage = 1;
            displayItems(items);
        });

        document.getElementById('tag-select').addEventListener('change', () => {
            currentPage = 1;
            displayItems(items);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        return;
    }
};

const fillCategories = (categories) => {
    try {
        const catSelect = document.getElementById('category-select');
        catSelect.innerHTML = '<option value="all">All</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category;
            option.textContent = category.category.charAt(0).toUpperCase() + category.category.slice(1);
            catSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error filling categories:', error);  
    }
};

const fillTags = (allTags) => {
    try {
        const tagSelect = document.getElementById('tag-select');
        tagSelect.innerHTML = '<option value="all">All</option>';
        allTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
            tagSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error filling tags:', error);  
    }
};

const renderPageControls = (totalpages) => {
    const pagecontainer = document.getElementById('pageContainer')  || document.createElement('div');
    pagecontainer.id = 'pageContainer';
    pagecontainer.innerHTML = '';

    for(let i = 1; i <=totalpages ; i++) {
        const pagebtn = document.createElement('button');
        pagebtn.textContent = i;
        pagebtn.disabled = ( i === currentPage);
        pagebtn.addEventListener('click' , () => {
            currentPage = i;
            displayItems(items);
        })
        pagecontainer.appendChild(pagebtn);
    }

    if (!document.getElementById('pageContainer')) {
    document.getElementById('itemContainer').after(pagecontainer);
  }
}

const displayItems = (items) => {
    try {
        const itemContainer = document.getElementById('itemContainer');
        const cat = document.getElementById('category-select').value;
        const tag = document.getElementById('tag-select').value;
        itemContainer.innerHTML = '';

        // fixed my filtering logic (was a bit off)
        const filteredItems = items.filter(item => {
           const matchesTag = (tag === 'all' || item.tags.split('|').includes(tag));
           const matchesCat = (cat === 'all' || item.category === cat);
           return matchesTag && matchesCat;
        });

        //add pages feature
        const totalPages = Math.ceil(filteredItems.length/itemsPerPage);
        const start = (currentPage - 1)* itemsPerPage;
        const end = start + itemsPerPage;
        const pagedItems = filteredItems.slice(start,end);

        pagedItems.forEach(fitem => {
            const itemCard = document.createElement('div');
            itemCard.className = 'item-card';
            itemCard.innerHTML = `
                <img src="https://picsum.photos/id/${Math.floor(Math.random() * 10)}/200/300" alt="${fitem.name}">
                <h3>${fitem.name}</h3>
                <p>${fitem.description}</p>
                <p>Price: $${fitem.price}</p>
                <p>Category: ${fitem.category}</p>
                <p>Tags: ${fitem.tags.split('|').join(", ")}</p>
            `;
            itemContainer.appendChild(itemCard);
        }) 
          renderPageControls(totalPages);

    } catch (error) {
        console.error('Error displaying items:', error);
    }
}

window.onload = () => {
    fetchData();
}