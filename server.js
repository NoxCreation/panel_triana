import { startCronJob } from './src/cron/cron-job.js';

// Inicia el cron job y lo deja corriendo en segundo plano
startCronJob();

// Opcional: Agrega logs para verificar que el cron está activo
console.log('✅ Cron job iniciado. El proceso continuará corriendo en segundo plano.');