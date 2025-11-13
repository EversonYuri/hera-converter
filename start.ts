import { exec } from 'child_process';
import { rm } from 'fs/promises';

exec('net stop Tomcat7', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error stopping Tomcat7: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Tomcat7 stopped successfully:\n${stdout}`);
})

rm('C:/HERA/tomcat/webapps/gestaofacil', { recursive: true, force: true })
    .then(() => {
        console.log('Folder C:/HERA/tomcat/webapps/gestaofacil deleted successfully.');
    })
    .catch((err) => {
        console.error(`Error deleting folder: ${err.message}`);
    });

exec('net start Tomcat7', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error starting Tomcat7: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`Tomcat7 stopped successfully:\n${stdout}`);
});