<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\Category;
use App\Models\Price;

use PDO;


interface ProductRepositoryInterface
{
    public function getAllProducts();  // Method to get all products
    public function getProductById($id);  // Method to get a single product by its ID
}

class ProductRepository implements ProductRepositoryInterface
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllProducts()
    {
        $query = "
        SELECT
            p.id AS id,
            p.name AS name,
            p.description AS description,
            p.inStock AS inStock,
            p.brand AS brand,
            c.id AS category_id,
            c.name AS category_name,
            prc.amount AS price_amount,
            prc.currency_label,
            prc.currency_symbol
        FROM
            products p
        LEFT JOIN
            categories c ON p.category_id = c.id
        LEFT JOIN
            prices prc ON p.id = prc.product_id
        ";

        $stmt = $this->pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);


        if (empty($results)) {
            return [];
        }

        $imagesByProductId = $this->getProductImages();
        $products = [];
        foreach ($results as $row) {
            $products[] = $this->createProductFromRow($row, $imagesByProductId[$row["id"]]);
        }

        return $products;
    }

    public function getProductById($id)
    {
        $query = "
            SELECT
                p.id AS id,
                p.name AS name,
                p.description AS description,
                p.inStock AS inStock,
                c.id AS category_id,
                c.name AS category_name,
                p.brand AS brand,
                prc.amount AS price_amount,
                prc.currency_label,
                prc.currency_symbol
            FROM
                products p
            LEFT JOIN
                categories c ON p.category_id = c.id
            LEFT JOIN
                prices prc ON p.id = prc.product_id
            WHERE
                p.id = :productId
        ";

        $stmt = $this->pdo->prepare($query);
        $stmt->bindParam(":productId", $id, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return null;
        }

        $imagesByProductId = $this->getProductImages($id);

        return $this->createProductFromRow($result, $imagesByProductId[$id]);
    }

    private function getProductImages($productId = null)
    {
        $query = "SELECT * FROM product_images";
        $params = [];

        if ($productId !== null) {
            $query .= " WHERE product_id = :productId";
            $params[':productId'] = $productId;
        }

        $stmt = $this->pdo->prepare($query);
        $stmt->execute($params);
        $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $imagesByProductId = [];
        foreach ($images as $image) {
            $pid = $image["product_id"];
            $imagesByProductId[$pid][] = $image["image_url"];
        }

        return $imagesByProductId;
    }

    private function createProductFromRow($row, $images)
    {
        $category = new Category($row["category_id"], $row["category_name"]);
        $price = new Price($row["price_amount"], $row["currency_label"], $row["currency_symbol"]);

        $product = new Product(
            $row["id"],
            $row["name"],
            $row["description"],
            $row["inStock"],
            $category,
            $row["brand"],
            $price,
            $images
        );
        return $product;
    }
}