import { z } from 'zod'

export const projectSchema = z.object({
    name  : z.string(),
    description:z.string(),
    GitHub :z.string(),
    TechStack :z.string(),
    Hostedlink:z.string(),
    
});

