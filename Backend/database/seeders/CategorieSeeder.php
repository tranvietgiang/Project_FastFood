<?php

namespace Database\Seeders;

use App\Models\Categorie;
use GuzzleHttp\Promise\Create;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $categories = [
            "Pizza",
            "Burger",
            "Mì ý",
            "Cơm",
            "Bánh",
            "Món ăn kèm",
            "Nước uống"
        ];

        foreach ($categories as $name) {
            Categorie::create([
                "cate_name" => $name
            ]);
        }
    }
}