
import { z } from 'zod';
import { PlanSchema } from './role-user.schema';

// Schema base com campos comuns
export const commonSchema = z.object({
  businessName: z.string().min(2, 'Nome do negócio deve ter no mínimo 2 caracteres'),
  specialties: z.array(z.string()).min(1, 'Selecione pelo menos uma especialidade'),
  profileDescription: z.string().optional().nullable(),
  subscriptionPlan: PlanSchema.default('FREE'),
  isActive: z.boolean().default(true),
  companyId: z.string().uuid().optional().nullable(),
});

// Schema completo do Professional
export const ProfessionalSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  averageRating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().int().min(0).default(0),
  totalAppointments: z.number().int().min(0).default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
}).merge(commonSchema);

// Schema para criação
export const CreateProfessionalSchema = commonSchema;

// Schema para atualização (campos opcionais)
export const UpdateProfessionalSchema = commonSchema.partial();

// Schema para input de criação (sem campos automáticos)
export const CreateProfessionalInput = ProfessionalSchema.omit({
  id: true,
  userId: true,
  averageRating: true,
  totalRatings: true,
  totalAppointments: true,
  createdAt: true,
  updatedAt: true,
});