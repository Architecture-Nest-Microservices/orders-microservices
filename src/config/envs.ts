import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
    PORT: number;
}

// validacion de schema, si no es valido, se lanza una excepcion
const envVarsSchema = joi
    .object({
        PORT: joi.number().required()
    })
    .unknown();

const { error, value } = envVarsSchema.validate(process.env);

if (error) {
    throw new Error(
        `Error al validar las variables de entorno: ${error.message}`
    );
}

const envVars: EnvsVars = value;

export const envs = {
    port: envVars.PORT
};
