import { AppConfig } from '../interfaces/app/config';

export default <AppConfig>{ serviceName: 'Main', actionsDir: 'actions', transporter: 'redis://127.0.0.1:6379' };