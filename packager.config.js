import packager from 'electron-packager';
import fs from 'fs-extra';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function buildPortable() {
  const options = {
    // Configurazione base
    dir: './',
    name: 'MasterMind',
    platform: 'win32',
    arch: 'x64',
    out: './dist',
    overwrite: true,
    
    // Configurazione portable
    asar: false,
    prune: true,
    
    // File da ignorare
    ignore: [
      /^\/\.git($|\/)/,
      /^\/node_modules\/electron($|\/)/,
      /^\/dist($|\/)/,
      /^\/temp-build($|\/)/,
      /^\/build-scripts($|\/)/,
      /\.md$/,
      /\.log$/,
      /\.env$/
    ],
    
    // Dopo la copia dei file
    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        console.log('Customizing portable build...');
        
        // Crea directory per dati portable
        const portableDirs = ['data', 'config', 'logs'];
        portableDirs.forEach(dir => {
          fs.ensureDirSync(path.join(buildPath, dir));
        });
        
        // Crea file di configurazione portable
        const portableConfig = {
          version: '0.8.1',
          portable: true,
          dataPath: './data'
        };
        
        fs.writeJsonSync(path.join(buildPath, 'portable-config.json'), portableConfig);
        callback();
      }
    ]
  };

  try {
    console.log('Starting portable build...');
    
    // Esegui il packaging
    const appPaths = await packager(options);
    
    if (appPaths && appPaths.length > 0) {
      const sourceDir = appPaths[0];
      const finalDir = './dist/MasterMind';

      // Pulisci eventuale output precedente
      await fs.remove(finalDir);

      // Copia nella directory finale
      await fs.copy(sourceDir, finalDir, { overwrite: true });

      // Rimuovi SOLO la cartella temporanea generata da electron-packager
      await fs.remove(sourceDir);

      console.log('✅ Build completed successfully!');
      console.log('📁 Portable app location: ', path.resolve(finalDir));
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error);
  }
}

// Esegui la funzione solo se chiamato direttamente via `node packager.config.js`
try {
  const isDirectRun = process.argv[1] && (import.meta.url === pathToFileURL(process.argv[1]).href);
  if (isDirectRun) {
    // Non attendo esplicitamente per compatibilità, i log mostreranno l'esito
    buildPortable();
  }
} catch {}