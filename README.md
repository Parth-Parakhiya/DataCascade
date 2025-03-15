# DataCascade

![DataCascade Logo](./images/logo.png)

DataCascade is a distributed file storage and retrieval system built on Django. It efficiently manages file chunking and storage across multiple nodes, ensuring high availability, redundancy, and performance.

## Features

- **Distributed Storage:** Files are divided into chunks and stored across multiple nodes.
- **Redundancy & Replication:** Multiple copies of file chunks ensure data reliability.
- **Error Detection:** Implements checksums for verifying file integrity.
- **Optimized Retrieval:** Retrieves files from the nearest or least-loaded node.
- **User-Friendly Admin Panel:** Monitor file distribution, node status, and system health in real time.

## Demo & Screenshots

![Dashboard Screenshot](./images/dashboard.png)
*Screenshot of the DataCascade Admin Dashboard*

## Getting Started

### Prerequisites

- Python 3.8+
- Django 4.x
- [MinIO](https://min.io/)

