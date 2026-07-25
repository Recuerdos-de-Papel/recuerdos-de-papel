import { Request, Response, NextFunction } from 'express';
import { createFamilySchema, updateFamilySchema } from '../validators';
import { getFamilies, getFamiliesByCategory, getFamilyById, createFamily, updateFamily, deleteFamily } from '../services';

export const getFamiliesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const families = await getFamilies();
    res.json(families);
  } catch (error) {
    next(error);
  }
};

export const getFamiliesByCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const families = await getFamiliesByCategory(req.params.categoryId);
    res.json(families);
  } catch (error) {
    next(error);
  }
};

export const getFamilyByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const family = await getFamilyById(req.params.id);
    res.json(family);
  } catch (error) {
    next(error);
  }
};

export const createFamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createFamilySchema.parse(req.body);
    const family = await createFamily(data);
    res.status(201).json(family);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const updateFamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateFamilySchema.parse(req.body);
    const family = await updateFamily(req.params.id, data);
    res.json(family);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

export const deleteFamilyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFamily(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
