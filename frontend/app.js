const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

document.getElementById('connectWalletButton').addEventListener('click', async () => {
    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        console.log("Wallet connected!");

        document.getElementById('crudOperations').style.display = 'block';
    } catch (error) {
        console.error("Failed to connect wallet:", error);
        alert("Failed to connect wallet. Please make sure your Ethereum wallet is installed and unlocked.");
    }
});


const contractAddress = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
const contractABI = [{
        "inputs": [{
            "internalType": "string",
            "name": "data",
            "type": "string"
        }],
        "name": "create",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }],
        "name": "deleteItem",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllItems",
        "outputs": [{
            "components": [{
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "data",
                    "type": "string"
                }
            ],
            "internalType": "struct SimpleCRUD.Item[]",
            "name": "",
            "type": "tuple[]"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "name": "items",
        "outputs": [{
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextId",
        "outputs": [{
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
        }],
        "name": "read",
        "outputs": [{
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "itemId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "data",
                "type": "string"
            }
        ],
        "name": "update",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

async function createItem() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, signer);

    const createInput = document.getElementById('createInput').value;
    try {
        const tx = await crudContract.create(createInput);
        await tx.wait();
        console.log('Item created:', createInput);
    } catch (error) {
        console.error(error);
    }
}

/* async function readItem() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, signer);

    const itemID = 1;
    try {
        const data = await crudContract.read(itemID);
        console.log('Item data:', data);
        document.getElementById('readOutput').innerText = `Item ${itemID}: ${data}`;
    } catch (error) {
        console.error('Error reading item:', error);
        document.getElementById('readOutput').innerText = 'Error reading item.';
    }
} */
async function readItem() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, provider);
    const itemID = 0;
    try {
        // const data = await crudContract.read(itemID);
        // console.log('Item data:', data);
        console.log(await crudContract.getAllItems())
        // document.getElementById('readOutput').innerText = `Item ${itemID}: ${data[1]}`; 
    } catch (error) {
        console.error('Error reading item:', error);
        document.getElementById('readOutput').innerText = 'Error reading item.';
    }
}

async function readAllItems() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, signer);
    const tableBody = document.getElementById('itemsTable');
    tableBody.innerHTML = ''; 

    try {
        const items = await crudContract.getAllItems();
        console.log('x',items)
        items.forEach((item, index) => {
            const row = `<tr>
                <th scope="row">${item.id}</th>
                <td>${item.data}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="updateItemPrompt(${item.id})">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItemPrompt(${item.id})">Delete</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error reading items:', error);
    }
}

async function updateItemPrompt(id) {
    updateIdInput = document.getElementById('updateIdInput')
    updateIdInput.value = id
}


async function updateItem() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, signer);

    const idToUpdate = document.getElementById('updateIdInput').value;
    const newData = document.getElementById('updateDataInput').value;
    try {
        const tx = await crudContract.update(idToUpdate, newData);
        await tx.wait();
        console.log(`Item ${idToUpdate} updated`);
    } catch (error) {
        console.error(error);
    }
}

async function deleteItem() {
    const crudContract = new ethers.Contract(contractAddress, contractABI, signer);

    const idToDelete = document.getElementById('deleteInput').value;
    try {
        const tx = await crudContract.deleteItem(idToDelete);
        await tx.wait();
        console.log(`Item ${idToDelete} deleted`);
    } catch (error) {
        console.error(error);
    }
}

// window.createItem = createItem;
// window.readAllItems = readAllItems;