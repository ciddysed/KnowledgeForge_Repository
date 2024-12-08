package com.g1AppDev.KnowledgeForge.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.g1AppDev.KnowledgeForge.Entity.Module;
import com.g1AppDev.KnowledgeForge.Repository.ModuleRepo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ModuleService {

    
    @Autowired
    private final ModuleRepo moduleRepository;
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();
    private static final Logger logger = LoggerFactory.getLogger(ModuleService.class);

    public ModuleService(ModuleRepo moduleRepository) {
        this.moduleRepository = moduleRepository;
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    // Create
    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    // Find by ID
    public Optional<Module> findModuleById(int id) {
        return moduleRepository.findById(id);
    }

    // Find All
    public List<Module> findAllModules() {
        return moduleRepository.findAll();
    }

    // Find by Topic ID
    public List<Module> findModulesByTopicId(int topicId) {
        return moduleRepository.findByTopic_TopicID(topicId);
    }

    // Update
    public Module updateModule(int id, Module updatedModule) {
        Optional<Module> existingModule = moduleRepository.findById(id);
        if (existingModule.isPresent()) {
            Module module = existingModule.get();
            module.setModuleName(updatedModule.getModuleName());
            return moduleRepository.save(module);
        }
        return null;
    }

    // Delete
    public boolean deleteModule(int id) {
        if (moduleRepository.existsById(id)) {
            moduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public boolean deleteModulesByTopicId(int topicId) {
        List<Module> modules = moduleRepository.findByTopic_TopicID(topicId);
        if (!modules.isEmpty()) {
            moduleRepository.deleteAll(modules);
            return true;
        }
        return false;
    }

    public List<Module> updateModulesByTopicId(int topicId, List<Module> updatedModules) {
        List<Module> existingModules = moduleRepository.findByTopic_TopicID(topicId);
        if (!existingModules.isEmpty()) {
            moduleRepository.deleteAll(existingModules);
            return moduleRepository.saveAll(updatedModules);
        }
        return null;
    }

    public void uploadFile(int moduleId, MultipartFile file) {
        if (!file.getContentType().equals("application/pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed.");
        }

        Optional<Module> optionalModule = moduleRepository.findById(moduleId);
        if (optionalModule.isPresent()) {
            Module module = optionalModule.get();
            module.setUploadedFileName(file.getOriginalFilename());
            moduleRepository.save(module);

            try {
                Path targetLocation = this.fileStorageLocation.resolve(file.getOriginalFilename());
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                logger.info("File saved at: " + targetLocation.toString());
                if (Files.exists(targetLocation)) {
                    logger.info("File exists at: " + targetLocation.toString());
                } else {
                    logger.error("File does not exist at: " + targetLocation.toString());
                }
            } catch (Exception ex) {
                logger.error("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
                throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
            }
        } else {
            logger.error("Module not found with ID: " + moduleId);
        }
    }
}