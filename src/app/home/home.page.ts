import { Component} from '@angular/core';
//import * as L from "leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
declare var require: any
import { Platform, LoadingController, ToastController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as $ from "jquery";
import { RegistrationService } from '../Registration/registration.service';
import { Network } from '@ionic-native/network/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public static AppVersion = "1.0.3";
  HomePageVer = HomePage.AppVersion;
  selectedLanguage:string;
  
 
  languageChanged(){
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }

   // Global Declaration
 //#region 
 
 geoserver_url = "https://yoddha.coderize.in/geoserver/CovidYoddha/wms";
 //geoserver_url = "http://yoddha.coderize.in:8082/geoserver/CovidYoddha/wms";
 overlays: {};
  ddOverlays: any[] = [];
  baseLayers:{};
  map: any;
  subscribe:any;
  accuracy: number;
  isRegister: any;

static initialMapLoad: boolean = false;
toast: any;

  //Layer Declaration
   // Global decleration for layer's table
   HospitalsLayer_table = "Hospitals";
   LabsLayer_table = "CovidLabs";
   WardBoundaryLayer_table = "WardBoundary";
   EmergencyServicesLayer_table = "EmergencyServices";
   pincodeLayer_table ="Pincode";

 
   //Operational Layers Global Declaration
   HospitalsLayer;
   LabsLayer;
   WardBoundaryLayer;
   EmergencyServicesLayer
   pincodeLayer;

    // Global decleration for layer's visible name
    HospitalsLayer_VisibleName = "Hospitals";
    LabsLayer_VisibleName = "CovidLabs";
    WardBoundaryLayer_VisibleName = "WardBoundary";
    EmergencyServicesLayer_VisibleName = "EmergencyServices";
    pincodeLayer_VisibleName ="Pincode";

    //#endregion
    tabBarElement: any;

// costructor
//#region 
constructor(private platform: Platform,
    public loadingController:LoadingController,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public toastController: ToastController,
    public router: Router,
     public citizenService: RegistrationService,
     private network: Network,
     private translateConfigService: RegistrationService,
     private translate: TranslateService,
     private location: Location 
    ) 
    { 
      this.tabBarElement = document.querySelector('#myTabBar')

      this.platform.backButton.subscribeWithPriority(6666666,()=>{
        if(window.confirm(this.translate.instant("Do you really want to Exit the App")))
        {
          navigator["app"].exitApp();
        }
    });
    
      this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
  
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.showToast(this.translate.instant("There may be a problem in your internet connection. Please Check a Connection and try again!"))
      });
      disconnectSubscription.unsubscribe();
}  
//#endregion





//Layer Adding functions
//#region 
initOperationalLayers() {
 let HospitalsLayer: L.Layer = L.tileLayer.wms(this.geoserver_url, {
  layers: "CovidYoddha:Hospitals",
  format: "image/png",
  transparent: true,
  opacity: 0.6
});
this.HospitalsLayer = HospitalsLayer;
//this.map.addLayer(this.HospitalsLayer);

 let LabsLayer: L.Layer = L.tileLayer.wms(this.geoserver_url, {
  layers: "CovidYoddha:CovidLabs",
  format: "image/png",
  transparent: true,
  opacity: 0.6
});
 this.LabsLayer = LabsLayer;
 //this.map.addLayer(this.LabsLayer);

 let pincodeLayer: L.Layer = L.tileLayer.wms(this.geoserver_url, {
  layers: "CovidYoddha:Pincode",
  format: "image/png",
  transparent: true,
  opacity: 0.6
});
 this.pincodeLayer = pincodeLayer;
 //this.map.addLayer(this.LabsLayer);

 let EmergencyServicesLayer: L.Layer = L.tileLayer.wms(this.geoserver_url, {
  layers: "CovidYoddha:EmergencyServices",
  format: "image/png",
  transparent: true,
  opacity: 0.6
});
this.EmergencyServicesLayer = EmergencyServicesLayer;
//this.map.addLayer(this.HospitalsLayer);

 let WardBoundaryLayer: L.Layer = L.tileLayer.wms(this.geoserver_url, {
  layers: "CovidYoddha:WardBoundary",
  format: "image/png",
  transparent: true,
  opacity: 0.6
});
 this.WardBoundaryLayer = WardBoundaryLayer;
 //this.map.addLayer(this.WardBoundaryLayer);
 }


 initOverlays() {
  this.overlays = {
    "Labs": this.LabsLayer,
    "Hospitals": this.HospitalsLayer,
    //"EmergencyServices": this.EmergencyServicesLayer,
    // "WardBoundary": this.WardBoundaryLayer,
    "Pincode Boundary": this.pincodeLayer,

  };
   this.ddOverlays.push({name: 'CovidLabs', layer: this.LabsLayer});
   this.ddOverlays.push({name: 'Hospitals', layer: this.HospitalsLayer});
   this.ddOverlays.push({name: 'EmergencyServices', layer: this.EmergencyServicesLayer});
  //  this.ddOverlays.push({name: 'WardBoundary', layer: this.WardBoundaryLayer});
   this.ddOverlays.push({name: 'Pincode Boundary', layer: this.pincodeLayer});

 }
//#endregion



//Gps & Location
//#region 
  //Check if application having GPS access permission  
  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
    
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();

            },
            error => {
              //Show alert if user click on 'No Thanks'
              console.log('Please Enable location Service');
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
      },
      error => alert('Your GPS is Turn on')
    );
  }
  //End Gps & Location
//#endregion


//OnInit Function
//#region 
  ionViewWillEnter(){
    this.tabBarElement.style.display = 'flex';
    this.checkGPSPermission();
    if(HomePage.initialMapLoad == false)
    {
      this.mapLoad();
      this.onMapReady(this.map);
      this.invalidateSize();
      this.initOperationalLayers();
      this.initOverlays();
      L.control.scale({ position: "bottomleft" }).addTo(this.map);
      L.control
      .layers(this.baseLayers, this.overlays, { collapsed: false })
      .addTo(this.map);
    //On map click popup
this.map.on('click', (evt) => { 
  this.getFeatureInfo(evt);
    });
      //#region //Grid Layer
    //   this.setLayerVisibility("GridLevel1", true);
      // this.setLayerVisibility("GridLevel2", true);
      // this.setLayerVisibility("GridLevel3", true);
      // this.setLayerVisibility("GridLevel4", true);
      // this.setLayerVisibility("GridLevel5", true);
      // this.setLayerVisibility("GridLevel6", true);
      //#endregion //Grid Layer
      this.addWatermark();  
    }
   
  }

  //OnInit Function
  ngOnInit() {
    //this.checkGPSPermission();
    $(".leaflet-top.leaflet-right").hide();
    //$('label[for="layerSelected-0"]').click();
    $("#mnuLayers").hide();
    //this.CusterMap_Hospital();
  }

//#endregion


  // Map Related Loader Function
  //#region 
 mapLoad(){
  this.map = new L.map('map').setView([18.5008, 73.9185],8, {minZoom:1, maxZoom:20}, 
    {zoomDelta: 0.50,
    zoomSnap: 0});
  this.map.on("load",function() { console.log("all visible tiles have been loaded") });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 
    'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
  }).addTo(this.map);
  HomePage.initialMapLoad = true;
this.getCurrentLocation();
// this.CusterMap();
}



//set visiblity function
setLayerVisibility(layerName, isVisible) {
  $(".leaflet-control-layers-list .leaflet-control-layers-selector").each(function(k, v) {
    var name = $.trim($(this).siblings("span").text());
    if (name == layerName) {
      $(this).click().prop("checked", isVisible);
      return;
    }
  });
 }


/// GET CURRENT LOCATION USING LEAFLET MAP

getCurrentLocation()
{
  this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp) => {
   //var latlng = [18.5008, 73.9185];
    var latlng = new L.LatLng(resp.coords.latitude, resp.coords.longitude);
    this.accuracy = resp.coords.accuracy;

    let mapOptions = {
      center: latlng,
      zoom: 16,
     }
     var current_position
  
     current_position = L.marker(latlng).addTo(this.map).bindPopup("You are here").openPopup();
 //console.log(current_position);

  //L.circle(latlng, 1000, {color: "red", opacity:.2}).addTo(this.map);
   // L.circle(latlng, 2000, {color: "green", opacity:.5}).addTo(this.map);
   L.circle(latlng, 1500, {color: "green", opacity:.7}).addTo(this.map);
this.map.flyTo(latlng,14);
})
}


// Map not load full so use this OnMapReady Function
//#region 
onMapReady(map) {
	this.map = map;
}

invalidateSize() {
	if (this.map) {
		setTimeout(() => {this.map.invalidateSize(true)},50);
	}
}
//#endregion



addWatermark() {
  var logo = new L.Control({ position: "bottomleft" });
  logo.onAdd = function() {
    var div = L.DomUtil.create("div", "watermark");
     div.innerHTML = "<img src='../assets/waterlogo.png' width='80'/>";
    return div;
  };
  logo.addTo(this.map);
}
//#endregion

// Service Layer Popup for All Layer
//#region 
url:string=this.geoserver_url;
counter = 0;
getFeatureInfo(evt){
  // Make an AJAX request to the server and hope for the best
   this.url = this.getFeatureInfoUrl(evt);
   this.counter+=1;
   //console.log(this.counter+"got GetFeatureinfo url "+this.url);
      var showResults = L.Util.bind(this.showGetFeatureInfo, this);
   // L.Util.bind(this.showGetFeatureInfo,this);
     
  $.ajax({
    url: this.url,
    success: function (data, status, xhr) {
      var err = typeof data === 'string' ? null : data;
      showResults(err, evt, data);
    },
    error: function (xhr, status, error) {
      showResults(error);  
    }
  }); 
//   console.log("In return "+this.dataContent);

// return this.dataContent;

}

getFeatureInfoUrl(evt) {
  // Construct a GetFeatureInfo request URL given a point
  var point = this.map.latLngToContainerPoint(evt.latlng, this.map.getZoom()),
      size = this.map.getSize(),
      params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
     /*   styles: this.wmsParams.styles,
        transparent: this.wmsParams.transparent,*/
        version:  "1.1",//this.wmsParams.version,      
        format: "application/openlayers", //this.wmsParams.format;
        bbox: this.map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        // layers: ["yoddha:WardBoundary","yoddha:EmergencyServices"], //this.wmsParams.layers,
        //layers: ["CovidYoddha:EmergencyServices", "CovidYoddha:CovidLabs", "CovidYoddha:Hospitals"], //this.wmsParams.layers,
        layers: ["CovidYoddha:CovidLabs", "CovidYoddha:Hospitals"], //this.wmsParams.layers,
        query_layers: ["CovidYoddha:CovidLabs", "CovidYoddha:Hospitals"], //this.wmsParams.layers,
       // query_layers: ["*"], //this.wmsParams.layers,
        info_format: 'application/json'
        // info_format: 'text/html' //'text/html'//'application/json'
      };
    //  console.log("Map Size"+ point, size);

  // params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
  // params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

  params['x'] = point.x;
  params['y'] = point.y;
  
  
  return this.geoserver_url + L.Util.getParamString(params, this.geoserver_url, true);
}


// show popup for json coustom popup
showGetFeatureInfo(err, evt, data) {
  // if (err) { console.log(err); return; } // do nothing if there's an error
  var feature = data.features[0];
  var Id = data.features[0].id;
  console.log("layer"+Id);
  var props = feature.properties;
// if(Id.includes("EmergencyServices"))
// {
//   L.popup()
//   .setLatLng(evt.latlng)
//   .setContent(L.Util.template(
//     "<h5>Emergency Services Details</h5>"+
//     "<b>Facility Type</b>:"+ props.poi_type +"<br>" +
//     "<b>Normal Zone severity</b>:"+ props.riskzone +"<br>" +
//     "<b>Lockdown Zone severity</b>:"+ props.riskzone_l+"<br>"))
//   .openOn(this.map);
// }
if(Id.includes("CovidLabs"))
{
  L.popup()
  .setLatLng(evt.latlng)
  .setContent(L.Util.template(
    "<h5>Labs Details</h5>"+
    "<b>Name</b>:"+ props.lab_name +"<br>" +
    "<b>Type</b>:"+ props.lab_type+"<br>"+
    "<b>City</b>:"+ props.city+"<br>"+
    "<b>Address</b>:"+ props.lab_addres +"<br>"))
  .openOn(this.map);
}
else if(Id.includes("Hospitals"))
{
  L.popup()
  .setLatLng(evt.latlng)
  .setContent(L.Util.template(
    "<h5>Hospital Details</h5>"+
    "<b>Name</b>:"+ props.hosp_name +"<br>" +
    "<b>Type</b>:"+ props.address+"<br>"+
    "<b>Contact</b>:"+ props.contact+"<br>"+
    "<b>City</b>:"+ props.city +"<br>"+
    "<b>State</b>:"+ props.state +"<br>"+
    "<b>Total Bed</b>:"+ props.total_beds +"<br>"+
    "<b>Occupied Bed</b>:"+ props.occupied_b +"<br>"+
    "<b>Available Bed</b>:"+ props.available +"<br>"+
    "<b>Total ventilator</b>:"+ props.total_vent +"<br>"+
    "<b>Used ventilator</b>:"+ props.used_venti +"<br>"+
    "<b>Available ventilator</b>:"+ props.availabl_1 +"<br>"+
    "<b>Staff</b>:"+ props.total_staf +"<br>"
    ))
  .openOn(this.map);
}

};


//#endregion


//Custer Add Function
//#region 
// CusterMap()
// {
//     var myIcon = L.icon({
//     iconUrl: 'images/pin24.png',
//     iconRetinaUrl: require('leaflet/dist/images/dark-blue-pin-md.png'),
//     iconSize: [29, 24],
//     iconAnchor: [9, 21],
//     popupAnchor: [0, -14]
//   });

//   var markerClusters = L.markerClusterGroup();

//  for ( var i = 0; i < this.markers.length; ++i )
//  {
//   var popup = this.markers[i].name +
//               '<br/>' + this.markers[i].city;

//   var m = L.marker([this.markers[i].lat, this.markers[i].lng], {icon: myIcon} ).bindPopup( popup );
  
//   markerClusters.addLayer( m );
// }

// this.map.addLayer( markerClusters );
//  }
 //#endregion


 //Custer Add Function Lab
  //#region 
  // Labs= [
  //   { "Lab_Name": "National Institute of Virology, Pune", "Lab_Addres": "National Institute of Virology, Pune, 130\/1, Pashan - Sus Rd, Pashan Gaon, Pashan, Pune, Maharashtra 411021", "Latitude": 18.5432517, "Longitude": 73.7889215, "Pincode": 411021.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //   { "Lab_Name": "Seth GS Medical College & KEM Hospital, Mumbai", "Lab_Addres": "Seth GS Medical College & KEM Hospital, Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012", "Latitude": 19.0024531, "Longitude": 72.8422882, "Pincode": 400012.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //   { "Lab_Name": "Kasturba Hospital for Infectious Diseases, Mumbai", "Lab_Addres": "Kasturba Hospital for Infectious Diseases, Sane Guruji Marg, Arya Nagar, Chinchpokli, Mumbai, Maharashtra 400034", "Latitude": 18.9840364, "Longitude": 72.8298487, "Pincode": 400034.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "National Institute of Virology Field Unit, Mumbai", "Lab_Addres": "National Institute of Virology Field Unit, Haffkine Institute Compound, A D Marg, Parel Mumbai 4000012", "Latitude": 19.0020772, "Longitude": 72.8440002, "Pincode": 400012.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Armed Forces Medical College, Pune", "Lab_Addres": "Armed Forces Medical College, Southern Command, Solapur Road, Wanowrie, near Race Course, Pune, Maharashtra 411040", "Latitude": 18.5040375, "Longitude": 73.8900961, "Pincode": 411040.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "BJ Medical College, Pune", "Lab_Addres": "BJ Medical College, Jai Prakash Narayan Road, Railway Station Rd, near Pune, Maharashtra 411001", "Latitude": 18.5262332, "Longitude": 73.8711312, "Pincode": 411001.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Indira Gandhi Government Medical College & Hospital, Nagpur", "Lab_Addres": "Indira Gandhi Government Medical College & Hospital, Mayo Hospital, Central Ave, Mominpura, Nagpur 440018", "Latitude": 21.153418, "Longitude": 79.0939735, "Pincode": 440018.0, "City": "Nagpur", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Grant Medical College & Sir JJ Hospital, Mumbai", "Lab_Addres": "Grant Medical College & Sir JJ Hospital, J J Marg, Nagpada-Mumbai Central, Noor Baug, Mazgaon, Mumbai, Maharashtra 400008", "Latitude": 18.9630684, "Longitude": 72.8336083, "Pincode": 400008.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Govt Medical College & Hospital Aurangabad", "Lab_Addres": "Govt Medical College & Hospital, University Road, Jubilee Park, Aurangabad, Maharashtra 431004", "Latitude": 19.8899963, "Longitude": 75.3181535, "Pincode": 431004.0, "City": "Aurangabad", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "V. M. Govt. Medical College, Solapur", "Lab_Addres": "V. M. Govt. Medical College, Opp. District Court, Solapur, Maharashtra 413003, India", "Latitude": 17.665311, "Longitude": 75.909637, "Pincode": 413003.0, "City": "Solapur", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Haffkine Institute, Mumbai", "Lab_Addres": "Haffkine Institute, Acharya Donde Marg, Parel, Mumbai 400012, Maharashtra", "Latitude": 19.0020507, "Longitude": 72.8437472, "Pincode": 400012.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Shree Bhausaheb Hire Govt Medical College, Dhule", "Lab_Addres": "Shree Bhausaheb Hire Govt Medical College, Chakkarbardi, Malegaon Road, Dhule, Maharashtra 424001", "Latitude": 20.8639536, "Longitude": 74.7623454, "Pincode": 424001.0, "City": "Dhule", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Government Medical College And Hospital, Miraj", "Lab_Addres": "Government Medical College And Hospital, Pandharpur Rd, Maji Sainik Vasahat, Miraj, Maharashtra 416410", "Latitude": 16.8370254, "Longitude": 74.6474007, "Pincode": 416410.0, "City": "Miraj", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "All India Institute of Medical Sciences (AIIMS), Nagpur", "Lab_Addres": "All India Institute of Medical Sciences (AIIMS), Plot No. 2, Sector - 20, MIHAN, Nagpur 441108 Maharashtra", "Latitude": 21.0385558, "Longitude": 79.0237737, "Pincode": 441108.0, "City": "Nagpur", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Nagpur Veterinary College, Nagpur", "Lab_Addres": "Department of Veterinary Public Health & Epidemiology, Nagpur Veterinary College. Seminary Hills, Nagpur 440006, Maharashtra", "Latitude": 21.1652176, "Longitude": 79.0459737, "Pincode": 440006.0, "City": "Nagpur", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Advanced Centre for Treatment, Research and Education in Cancer (ACTREC), Tata Memorial Centre, Navi Mumbai", "Lab_Addres": "Advanced Centre for Treatment, Research and Education in Cancer (ACTREC), Tata Memorial Centre, Kharghar, Navi Mumbai - 410210, INDIA.", "Latitude": 19.0652582, "Longitude": 73.0647597, "Pincode": 410210.0, "City": "Navi Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Govt. Medical College, Akola", "Lab_Addres": "Govt. Medical College, Ashok Vatika, District Collector Office Road, Near, Bhandaraj BK, Akola, Maharashtra 444001, India", "Latitude": 20.7025966, "Longitude": 77.001948, "Pincode": 444001.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "National Centre for Cell Science (NCCS), Pune", "Lab_Addres": "National Centre for Cell Science, NCCS Complex, Savitribai Phule Pune University Campus, Ganeshkhind Road, Pune - 411007, Maharashtra State, India", "Latitude": 18.5471922, "Longitude": 73.8315479, "Pincode": 411007.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "ICMR-National Institute for Research in Reproductive Health, Mumbai", "Lab_Addres": "ICMR-National Institute for Research in Reproductive Health, Jehangir Merwanji Street, Parel, Mumbai 400012, Maharashtra, India", "Latitude": 19.0024764, "Longitude": 72.8408109, "Pincode": 400012.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Rajiv Gandhi Medical College and Chhatrapati Shivaji Maharaj Hospital, Thane", "Lab_Addres": "Rajiv Gandhi Medical College and Chhatrapati Shivaji Maharaj Hospital, Thane - Belapur Rd, Kalwa West, Budhaji Nagar, Kalwa, Thane, Maharashtra 400605", "Latitude": 19.1912127, "Longitude": 72.9867026, "Pincode": 400605.0, "City": "Thane", "State": "Maharashtra", "Lab_Type": "Government Laboratory" }, 
  //    { "Lab_Name": "Thyrocare Technologies Limited, Navi Mumbai", "Lab_Addres": "Thyrocare Technologies Limited, D-37\/1 MIDC Turbhe Opp Sandoz, MIDC Industrial Area, Sanpada, Navi Mumbai, Maharashtra 400703", "Latitude": 19.061697, "Longitude": 73.0255759, "Pincode": 400703.0, "City": "Navi Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Suburban Diagnostics (India) Pvt. Ltd., Mumbai", "Lab_Addres": "Suburban Diagnostics (India) Pvt. Ltd., 2nd Floor Aston, Shastri Nagar, Andheri (W), Mumbai, Maharashtra, India 400053", "Latitude": 19.137332, "Longitude": 72.8260739, "Pincode": 400053.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Metropolis Healthcare Ltd, Mumbai", "Lab_Addres": "Metropolis Healthcare Ltd, 4th Floor, Commerical Building 1-A, Kohinoor City Mall, Off LBS Marg, Vidyavihar (West), Mumbai, Maharashtra 400070", "Latitude": 19.0820107, "Longitude": 72.8857205, "Pincode": 400070.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Sir H. N. Reliance Foundation Hospital and Research Center, Mumbai", "Lab_Addres": "Sir H.N. Reliance Foundation Hospital and Research Center, Reliance Life Sciences Pvt Ltd, MIDC, R-282, Thane - Belapur Rd, T.T.C. Industrial Area, Rabale, Navi Mumbai, Maharashtra 400701", "Latitude": 19.139211, "Longitude": 73.0044572, "Pincode": 400701.0, "City": "Navi Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "SRL Diagnostics, Goregaon West", "Lab_Addres": "SRL Diagnostics, Plot No 1, Prime Square building, Gaiwadi Industrial, estate, Next to Patel Petrol Pump, Opposite Mahesh Nagar, S.V. Road, Goregaon West, Mumbai, Maharashtra 400062", "Latitude": 19.1713976, "Longitude": 72.845615, "Pincode": 400062.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" },
  //    { "Lab_Name": "A.G Diagnostics Pvt Ltd, Pune", "Lab_Addres": "A.G Diagnostics Pvt Ltd, CTS No 809, F.P. 147, Nayantara Building, Bhandarkar Road, Pune, Maharashtra 411004", "Latitude": 18.5188049, "Longitude": 73.8309165, "Pincode": 411004.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" },
  //    { "Lab_Name": "Kokilaben Dhirubhai Ambani Hospital Laboratory, Mumbai", "Lab_Addres": "Kokilaben Dhirubhai Ambani Hospital Laboratory, Four Bungalows, Andheri (West), Mumbai, Maharashtra, India", "Latitude": 19.1310874, "Longitude": 72.825285, "Pincode": 400053.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "InfeXn Laboratories Private Ltd, Thane", "Lab_Addres": "InfeXn Laboratories Private Ltd, A\/131, Therelek Compound, Road Number 23, Wagle Industrial Estate, Thane West, Thane, Maharashtra 400604", "Latitude": 19.1950362, "Longitude": 72.9485606, "Pincode": 400604.0, "City": "Thane", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "iGenetic Diagnostics Pvt. Ltd., Mumbai", "Lab_Addres": "iGenetic Diagnostics Pvt. Ltd., 1st Floor, krislon House, Off Marol Military Road, Andheri East, Mumbai Maharashtra 400072", "Latitude": 19.1102606, "Longitude": 72.8870881, "Pincode": 400072.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Tata Memorial Centre Diagnostic Services, Tata Memorial Hospital, Mumbai", "Lab_Addres": "Tata Memorial Centre Diagnostic Services, Tata Memorial Hospital, Dept. of Microbiology & Serology, 6th Floor, Anexe Building, Tata Memorial Hospital, Dr. E. Borges Road, Parel, Mumbai 400012", "Latitude": 19.0049019, "Longitude": 72.8431686, "Pincode": 400012.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Sahyadri Speciality Labs, Pune", "Lab_Addres": "Sahyadri Speciality Labs, Plot No. 54, S.No. 80-90, Lokmanya Colony, Kothrud, Pune-411038, Maharashtra, India", "Latitude": 18.5077536, "Longitude": 73.8044186, "Pincode": 411038.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Dr. Jariwala Laboratory & Diagnostics LLP, Mumbai", "Lab_Addres": "Dr. Jariwala Laboratory & Diagnostics LLP, 1st Floor, Rasraj Heights, Rokadia Lane, Near Gokul Hotel Off,Mandpeshwar Road, Borivli (W), Mumbai-400092, Maharashtra", "Latitude": 19.2359918, "Longitude": 72.8565622, "Pincode": 400092.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Metropolis Healthcare Limited, Pune", "Lab_Addres": "Construction House, Ground Floor, First Floor & Second Floor, 796\/189-B, Bhandarkar Institute Road, Pune â€“ 411004, Maharashtra, India", "Latitude": 18.518273, "Longitude": 73.8344472, "Pincode": 411004.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Private Laboratory" },
  //    { "Lab_Name": "Ruby Hall Clinic, Department of Laboratory, Grant Medical Foundation, Pune", "Lab_Addres": "Ruby Hall Clinic, Department of Laboratory, Grant Medical Foundation, 40, Sassoon Road, Pune â€“ 411001, Maharashtra, India", "Latitude": 18.5333826, "Longitude": 73.8770173, "Pincode": 411001.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Qualilife Diagnostics, Mumbai", "Lab_Addres": "Qualilife Diagnostics, Balaji Arcade, 1st Floor, 544\/A, Above Janata Sahakari Bank, Netaji Subhash Road, Mulud â€“ West, Mumbai-400080", "Latitude": 19.1760571, "Longitude": 72.9537628, "Pincode": 400080.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "SRL Diagnostics- Dr. Avinash Phadke (SRL Diagnostics Pvt Ltd), Mumbai", "Lab_Addres": "SRL Diagnostics- Dr. Avinash Phadke (SRL Diagnostics Pvt Ltd), Mahalaxmi Engineering Estate, 2nd floor, near k.j.khilnani high school, Mahim West, Mahim, Mumbai, Maharashtra 400016", "Latitude": 19.0420125, "Longitude": 72.8429749, "Pincode": 400016.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" },
  //    { "Lab_Name": "Sunflower Laboratory And Diagnostic Center, Mumbai", "Lab_Addres": "Sunflower Laboratory And Diagnostic Center, Keshav Kunj, Marve Road, Malad West, Mumbai, Maharashtra 400064", "Latitude": 19.1928843, "Longitude": 72.8416863, "Pincode": 400064.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Aditya Birla Memorial Hospital â€“Laboratory (A Unit of Aditya Birla Health Services Ltd.), Pune", "Lab_Addres": "Aditya Birla Memorial Hospital â€“Laboratory (A Unit of Aditya Birla Health Services Ltd.), Aditya Birla Hospital Marg, Chinchwad, Pune-411033, Maharashtra, India", "Latitude": 18.625716, "Longitude": 73.774776, "Pincode": 411033.0, "City": "Pune", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //    { "Lab_Name": "Department of Laboratory Medicine â€“ P.D. Hinduja National Hospital & Medical Research Centre, Mumbai", "Lab_Addres": "Department of Laboratory Medicine â€“ P.D. Hinduja National Hospital & Medical Research Centre, Veer Savarkar Marg, Mahim (W), Mumbai- 400016, Maharashtra, India", "Latitude": 19.0335001, "Longitude": 72.838349, "Pincode": 400016.0, "City": "Mumbai", "State": "Maharashtra", "Lab_Type": "Private Laboratory" }, 
  //   ]
    
  //   Hospital=[
  //      {
  //       "Hospital_Name": "ACE Hospital",
  //       "Hospital_Address":"S.No. 32/2a, Erandwana, Behind Mehendale Garage",
  //       "Contact":"020-25434063 / 072",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"100",
  //     "Occupied_Beds":"80",
  //     "Available_Beds":"20",
  //      "Total_Ventilators":"100",
  //     "Occupied_Ventilators":"70",
  //     "Available_Ventilators":"30",
  //      "Total_Staff":"100",
  //      "Latitude":18.50486,
  //      "Longitude":73.8304066
        
    
  //   },
  //   {
  //       "Hospital_Name": "ADITYA BIRLA MEMORIAL HOSPITAL",
  //       "Hospital_Address":"Survey No.31, Thergaon, Chichwad, Pune-411 033.",
  //       "Contact":"020-30717500/30717687",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"100",
  //     "Occupied_Beds":"50",
  //     "Available_Beds":"50",
  //      "Total_Ventilators":"100",
  //     "Occupied_Ventilators":"50",
  //     "Available_Ventilators":"50",
  //      "Total_Staff":"200",
  //      "Latitude": 18.62489,
  //   "Longitude": 73.7763798
        
  //   },
  //   {
  //       "Hospital_Name": "POONA HOSPITAL & RESEARCH CENTRE",
  //       "Hospital_Address":"27,Sadhashiv Peth",
  //       "Contact":"020-2433 1706 / 6609 6000",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"500",
  //     "Occupied_Beds":"350",
  //     "Available_Beds":"150",
  //      "Total_Ventilators":"500",
  //     "Occupied_Ventilators":"250",
  //     "Available_Ventilators":"250",
  //      "Total_Staff":"500",
  //      "Latitude": 18.69763,
  //   "Longitude": 74.1385924
        
  //   },
  //   {
  //       "Hospital_Name": "RUBY HALL CLINIC",
  //       "Hospital_Address":"40, Sassonn Road, Pune - 411001",
  //       "Contact":"020-66455357 / 5145",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"400",
  //     "Occupied_Beds":"300",
  //     "Available_Beds":"100",
  //      "Total_Ventilators":"400",
  //     "Occupied_Ventilators":"200",
  //     "Available_Ventilators":"200",
  //      "Total_Staff":"500",
  //      "Latitude": 18.51089,
  //      "Longitude": 73.8421479
       
  //   },
  //   {
  //       "Hospital_Name": "SAHYADRI HOSPITAL [KOTHRUD]",
  //       "Hospital_Address":"Plot No. 9b, Neena Society, S.No.1484a/B,Paud Road,Opposite Vanaz,",
  //       "Contact":"020-67213300",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"300",
  //     "Occupied_Beds":"100",
  //     "Available_Beds":"200",
  //      "Total_Ventilators":"400",
  //     "Occupied_Ventilators":"200",
  //     "Available_Ventilators":"200",
  //      "Total_Staff":"400",
  //      "Latitude": 18.49563,
  //      "Longitude": 73.861884
        
  //   },
  //   {
  //       "Hospital_Name": "SANJEEVAN HOSPITAL",
  //       "Hospital_Address":"23, Off Karve Rd, Near Garware Collage",
  //       "Contact":"020-66093200 / 201",
  //       "City":"Pune",
  //       "Hospital_Type":"Multispeciality ",
  //      "Total_Beds":"300",
  //     "Occupied_Beds":"100",
  //     "Available_Beds":"200",
  //      "Total_Ventilators":"400",
  //     "Occupied_Ventilators":"200",
  //     "Available_Ventilators":"200",
  //      "Total_Staff":"400",
  //      "Latitude": 18.56695,
  //      "Longitude": 73.8192918
        
  //   }
  //   ]
  
  // Clusturing
  // CusterMap_Lab()
  // {

  //   const generatePulsatingMarker = function (radius, color) {
  //     const cssStyle = `
  //       width: ${radius}px;
  //       height: ${radius}px;
  //       background: ${color};
  //       color: ${color};
  //       box-shadow: 0 0 0 ${color};
  //     `
  //     return L.divIcon({
  //       html: `<span style="${cssStyle}" class="pulse"/>`,
  //       className: ''
  //     })
  //   }
  //   //   var myIcon = L.icon({
  //   //  iconUrl: require('leaflet/dist/images/lab.png'),
  //   //   iconRetinaUrl: require('leaflet/dist/images/lab.png'),
  //   //   // iconUrl: require('src/assets/lab.png'),
  //   //   // iconRetinaUrl: require('src/assets/lab.png'),
  //   //   iconSize: [29, 24],
  //   //   iconAnchor: [9, 21],
  //   //   popupAnchor: [0, -14]
  //   // }); 
  //   //var markerClusters = L.markerClusterGroup();
  //   var LabsClusters = L.markerClusterGroup();

  //  for ( var i = 0; i < this.Labs.length; ++i )
  //  {
  //   var popup = 'Lab Name:'+this.Labs[i].Lab_Name +
  //             '<br/>' + 'Address:'+this.Labs[i].Lab_Addres +
  //               '<br/>' + 'Type:'+this.Labs[i].Lab_Type +
  //               '<br/>' + 'Pincode:'+this.Labs[i].Pincode +
  //               '<br/>' + 'City:'+this.Labs[i].City;
  //               var pulsatingIcon = generatePulsatingMarker(10, 'blue');

  //   var m = L.marker([this.Labs[i].Latitude, this.Labs[i].Longitude], {icon: pulsatingIcon} ).bindPopup( popup );
  //   LabsClusters.addLayer( m );
  // } 
  // this.map.addLayer( LabsClusters );
  //  }
   //#endregion

   
   //cluster
   //#region 
  //  CusterMap_Hospital()
  //  {
  //   const generatePulsatingMarker = function (radius, color) {
  //     const cssStyle = `
  //       width: ${radius}px;
  //       height: ${radius}px;
  //       background: ${color};
  //       color: ${color};
  //       box-shadow: 0 0 0 ${color};
  //     `
  //     return L.divIcon({
  //       html: `<span style="${cssStyle}" class="pulse"/>`,
  //       className: ''
  //     })
  //   }
  //   //    var myIcon = L.icon({
  //   //   iconUrl: require('leaflet/dist/images/hospital.png'),
  //   //    iconRetinaUrl: require('leaflet/dist/images/hospital.png'),
  //   //   //  iconUrl: require('src/assets/hospital.png'),
  //   //   //  iconRetinaUrl: require('src/assets/hospital.png'),
  //   //    iconSize: [29, 24],
  //   //    iconAnchor: [9, 21],
  //   //    popupAnchor: [0, -14]
  //   //  });
   
  //    var markerClusters = L.markerClusterGroup();
   
  //   for ( var i = 0; i < this.Hospital.length; ++i )
  //   {
  //    var popup = 'Hospital Name:'+this.Hospital[i].Hospital_Name +
  //              '<br/>' + 'Hospital Address:'+this.Hospital[i].Hospital_Address +
  //                '<br/>' + 'Type:'+this.Hospital[i].Contact +
  //                '<br/>' + 'City:'+this.Hospital[i].City +
  //                '<br/>' + 'Hospital Type:'+this.Hospital[i].Hospital_Type+
  //                '<br/>' + 'Total Beds:'+this.Hospital[i].Total_Beds+
  //                '<br/>' + 'Occupied Beds:'+this.Hospital[i].Occupied_Beds+
  //                '<br/>' + 'Available Beds:'+this.Hospital[i].Available_Beds+
  //                '<br/>' + 'Total Ventilators:'+this.Hospital[i].Total_Ventilators+
  //                '<br/>' + 'Occupied Ventilators:'+this.Hospital[i].Occupied_Ventilators +
  //                '<br/>' + 'Available Ventilators:'+this.Hospital[i].Available_Ventilators +
  //                '<br/>' + 'Total Staff:'+this.Hospital[i].Total_Staff;
  //                var pulsatingIcon = generatePulsatingMarker(10, 'green');

   
  //    var m = L.marker([this.Hospital[i].Latitude, this.Hospital[i].Longitude], {icon: pulsatingIcon} ).bindPopup( popup );
     
  //    markerClusters.addLayer( m );
  //  }
   
  //  this.map.addLayer( markerClusters );
  //   }
   //#endregion

// Toster Method
  //#region 
  showToast(msg: string) {
    this.toast = this.toastController.create({
      message: msg,
      position: 'middle',
      duration: 4000,
      buttons: [this.translate.instant('Cancel')],
      animated: true,
      keyboardClose : true,
      cssClass: "my-custom-class",
    }).then((toastData) => {
    //  console.log(toastData);
      toastData.present();
    });
  }
  //#endregion

}



