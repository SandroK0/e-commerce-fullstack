<?php

namespace App\Resolvers;

use App\Repositories\CategoryRepository;

class CategoryResolver
{
    private $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getCategories()
    {

        $categories = $this->categoryRepository->getCategories();
        return $categories ? array_map(function ($category) {
            return $category->toArray();
        }, $categories) : null;
    }
}
