import React, { useState, useEffect } from 'react';
import { NavDestination, BloodGroupReport, PatientProfile } from './types';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeScreen } from './screens/HomeScreen';
import { TestScreen } from './screens/TestScreen';
import { ReportScreen } from './screens/ReportScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ScannerDialog } from './components/ScannerDialog';
import { PersonalDetailsDialog } from './components/PersonalDetailsDialog';
import { StorageService } from './services/storage';

// Automatically reset previous session data on page/app reload
StorageService.resetSessionOnReload();

export default function App() {
  const [currentDestination, setCurrentDestination] = useState<NavDestination>('Home');
  const [navHistory, setNavHistory] = useState<NavDestination[]>(['Home']);
  const [isScannerDialogOpen, setIsScannerDialogOpen] = useState(false);
  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<NavDestination | null>(null);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(() => StorageService.getPatientProfile());
  const [hardwareConnected, setHardwareConnected] = useState(true);
  const [reportCount, setReportCount] = useState(0);
  const [latestReportId, setLatestReportId] = useState<string | null>(null);
  const [downloadedTimestamp, setDownloadedTimestamp] = useState<number>(0);

  // Sync report count and profile from persistence
  const updateReportCount = () => {
    const reports = StorageService.getReports();
    setReportCount(reports.length);
    setPatientProfile(StorageService.getPatientProfile());
  };

  useEffect(() => {
    updateReportCount();
  }, [currentDestination]);

  // Handle navigation with history
  const navigateTo = (destination: NavDestination) => {
    if (destination !== currentDestination) {
      setNavHistory(prev => [...prev, destination]);
      setCurrentDestination(destination);
    }
  };

  // Intercept navigation if personal details are required
  const handleRequestDestination = (destination: NavDestination) => {
    if (destination === 'Home') {
      navigateTo('Home');
      return;
    }

    // If user hasn't submitted personal details yet, show the Personal Details popup
    if (!StorageService.hasSubmittedPersonalDetails()) {
      setPendingDestination(destination);
      setIsPersonalDetailsOpen(true);
      return;
    }

    navigateTo(destination);
  };

  // Handle saving details from the Personal Details popup
  const handlePersonalDetailsContinue = (details: { name: string; age: string; gender: 'Male' | 'Female' | 'Other' }) => {
    StorageService.savePatientProfile(details);
    StorageService.setSubmittedPersonalDetails(true);
    setPatientProfile(StorageService.getPatientProfile());
    setIsPersonalDetailsOpen(false);
    setDownloadedTimestamp(Date.now());

    // Continue to the requested destination (or default to Test)
    const targetDest = pendingDestination || 'Test';
    setPendingDestination(null);
    navigateTo(targetDest);
  };

  const handleTestComplete = (report: BloodGroupReport) => {
    setLatestReportId(report.id);
    setDownloadedTimestamp(Date.now());
    updateReportCount();
  };

  return (
    <AndroidFrame>
      <div 
        id="app-root-container"
        className="w-full h-full flex flex-col justify-between relative bg-[#FAF2F0]"
      >
        {/* Top App Bar (64dp on surface) */}
        <TopAppBar
          title="BE+"
          onHomeClick={() => navigateTo('Home')}
          onLinkClick={() => {
            if (!StorageService.hasSubmittedPersonalDetails()) {
              setPendingDestination('Test');
              setIsPersonalDetailsOpen(true);
            } else {
              setIsScannerDialogOpen(true);
            }
          }}
          hardwareConnected={hardwareConnected}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentDestination === 'Home' && (
            <HomeScreen
              onStartTest={() => handleRequestDestination('Test')}
              onOpenScannerDialog={() => {
                if (!StorageService.hasSubmittedPersonalDetails()) {
                  setPendingDestination('Test');
                  setIsPersonalDetailsOpen(true);
                } else {
                  setIsScannerDialogOpen(true);
                }
              }}
            />
          )}

          {currentDestination === 'Test' && (
            <TestScreen
              onTestComplete={handleTestComplete}
              onNavigateToReports={() => navigateTo('Report')}
            />
          )}

          {currentDestination === 'Report' && (
            <ReportScreen
              initialReportId={latestReportId}
              onStartNewTest={() => {
                setLatestReportId(null);
                navigateTo('Test');
              }}
              onReportDownloaded={() => {
                setDownloadedTimestamp(Date.now());
                updateReportCount();
              }}
            />
          )}

          {currentDestination === 'Profile' && (
            <ProfileScreen
              key={`profile-${downloadedTimestamp}`}
              onOpenScannerDialog={() => setIsScannerDialogOpen(true)}
              onOpenPersonalDetails={() => setIsPersonalDetailsOpen(true)}
            />
          )}
        </main>

        {/* Bottom Navigation Bar (80dp on surfaceContainer) */}
        <BottomNavBar
          currentDestination={currentDestination}
          onSelectDestination={handleRequestDestination}
          reportCount={reportCount}
        />

        {/* Personal Details Popup Menu (Triggered on first click of Test Now, Test, Report, Profile) */}
        <PersonalDetailsDialog
          isOpen={isPersonalDetailsOpen}
          onClose={() => {
            setIsPersonalDetailsOpen(false);
            setPendingDestination(null);
          }}
          onContinue={handlePersonalDetailsContinue}
          initialProfile={patientProfile}
        />

        {/* Top Bar Link_2 Hardware Scanner Status Dialog */}
        <ScannerDialog
          isOpen={isScannerDialogOpen}
          onClose={() => setIsScannerDialogOpen(false)}
          hardwareModel="BE-OptiScan 500 USB Sensor"
          isConnected={hardwareConnected}
          onToggleConnection={() => setHardwareConnected(!hardwareConnected)}
        />
      </div>
    </AndroidFrame>
  );
}
