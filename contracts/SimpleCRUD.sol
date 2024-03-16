// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleCRUD {
    struct Item {
        uint id;
        string data;
    }

    Item[] public items;
    uint public nextId = 0;

    function create(string memory data) public {
        items.push(Item(nextId, data));
        nextId++;
    }

    function read(uint id) public view returns (bool success, uint itemId, string memory data) {
        for(uint i = 0; i < items.length; i++) {
            if(items[i].id == id) {
                return (true, items[i].id, items[i].data);
            }
        }
        return (false, 0, "");
    }

    function getAllItems() public view returns (Item[] memory) {
        return items;
    }

    // function getItems() public view returns (string[] memory) {
    //     return items;
    // }


    function update(uint id, string memory data) public {
        uint index = find(id);
        items[index].data = data;
    }

    /* function deleteItem(uint id) public {
        uint index = find(id);
        delete items[index];
    } */
    function deleteItem(uint id) public {
        uint index = find(id);
        require(index < items.length, "Index out of bounds");

        items[index] = items[items.length - 1];

        items.pop();
    }

    function find(uint id) view internal returns (uint) {
        for(uint i = 0; i < items.length; i++) {
            if(items[i].id == id) {
                return i;
            }
        }
        revert('Item not found');
    }
}
