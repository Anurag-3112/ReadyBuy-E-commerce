import * as repository from "./category.repository.js";
import { generateSlug } from "../../shared/utils/slug.js";

export const createCategoryService =
    async (payload) => {

        payload.slug = generateSlug(
            payload.name
        );

        const existing =
            await repository.categoryExists(
                payload.name
            );

        if (existing) {
            throw new Error(
                "Category already exists."
            );
        }

        const existingSlug =
            await repository.categorySlugExists(
                payload.slug
            );

        if (existingSlug) {
            throw new Error(
                "Slug already exists."
            );
        }

        return repository.createCategory(
            payload
        );
    };

export const getCategoriesService = (
    query
) =>
    repository.getCategories(query);

export const getAllCategoriesService =
    () =>
        repository.getAllCategories();

export const getCategoryService = (
    id
) =>
    repository.getCategoryById(id);

export const getCategoryBySlugService =
    (slug) =>
        repository.getCategoryBySlug(
            slug
        );

export const updateCategoryService =
    async (id, payload) => {

        payload.slug = generateSlug(
            payload.name
        );

        const existingSlug =
            await repository.categorySlugExists(
                payload.slug,
                id
            );

        if (existingSlug) {
            throw new Error(
                "Slug already exists."
            );
        }

        return repository.updateCategory(
            id,
            payload
        );
    };

export const deleteCategoryService =
    async (id) => {

        const category =
            await repository.getCategoryById(
                id
            );

        if (!category) {
            throw new Error(
                "Category not found."
            );
        }

        const productCount =
            await repository.countProductsByCategory(
                category.slug
            );

        if (productCount > 0) {
            throw new Error(
                "Category contains products."
            );
        }

        return repository.deleteCategory(
            id
        );
    };