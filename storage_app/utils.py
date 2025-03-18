# storage_app/utils.py

from minio import Minio

def get_minio_data():
    # This function establishes a connection to the MinIO server and returns a list of all available buckets.
    client = Minio(
        "localhost:9000",
        access_key="admin",
        secret_key="adminadmin",
        secure=False
    )
    # List all buckets
    buckets = client.list_buckets()
    return buckets