import math

def calculate_delivery_cost(i, base_cost, weight, distance, offer):
    base = base_cost + weight * 10 + distance * 5 
    discount = 0

    if distance < 200 and (weight >= 70 and weight <= 200) and offer == 'OFR001':
        discount = 10
    elif (distance >= 50 and distance <= 150) and (weight >= 100 and weight <= 250)  and offer == 'OFR002':
        discount = 7
    elif (distance >= 50 and distance <= 250) and (weight >= 10 and weight <= 150)  and offer == 'OFR003':
        discount = 5
    
    discount_cost = (base * discount) / 100
    final_cost = base - discount_cost

    return f"PKG{i}", discount_cost, final_cost

def calculate_delivery_time(base_cost, packages, number_of_vehicles, max_speed, max_weight):
    vehicles = []
    for i in range(number_of_vehicles):
      vehicles.append({"id":i+1, "packages": [],  "booked": False, "totaltime":0})
    
    time_list = []
    
    def calculate_time(pkg, vehicle_time):
      # print(pkg['id'], pkg['distance'] / max_speed, vehicle_time)
      num = (pkg['distance'] / max_speed) + vehicle_time
      return math.floor(num * 100) / 100
    
    remaining_packages = []
    for i in range(len(packages)):
      max_weight_package = max(packages, key=lambda x: x['weight'])
      for j in range(i+1, len(packages)):
        weight_sum = packages[i]['weight'] + packages[j]['weight']
        if max_weight_package['weight'] < weight_sum and weight_sum <= max_weight:
          # print(f"\nPair found: Element {i} with weight {packages[i]['weight']} and Element {j} with weight {packages[j]['weight']}")
          for item in vehicles:
            if item['booked'] == False:
              time_list.append({'id':packages[i]['id'], 'time': calculate_time(packages[i], item['totaltime']) })
              time_list.append({'id':packages[j]['id'], 'time': calculate_time(packages[j], item['totaltime']) })
              t1 = 2 * packages[i]['distance'] / max_speed
              t2 = 2 * packages[j]['distance'] / max_speed
              item["totaltime"] = max(t1, t2)
              item["booked"] = True
              item["packages"].extend([packages[i], packages[j]])
              break
          remaining_packages.append(packages[i])
          remaining_packages.append(packages[j])
          break
    # print("remaining_packages",remaining_packages)
    # print("sorted packages after pop", packages)
    
    filtered_package = [pkg for pkg in packages if pkg not in remaining_packages]
    sorted_packages = sorted(filtered_package, key=lambda x: x["weight"], reverse=True)
    for i in range(len(sorted_packages)):
      available_vehicle = min(vehicles, key=lambda x:x['totaltime'])
      # print("available_vehicle",available_vehicle)
      time_list.append({'id':sorted_packages[i]['id'], 'time': calculate_time(sorted_packages[i], available_vehicle['totaltime']) })
      t = available_vehicle['totaltime'] + (2 * (sorted_packages[i]['distance'] / max_speed))
      available_vehicle['totaltime'] = t
      available_vehicle['packages'].extend([sorted_packages[i]])
      for v in range(len(vehicles)):
        if vehicles[v]['id'] == available_vehicle['id']:
          vehicles[v] = available_vehicle
    # print(time_list)
    return time_list

def main():
    base_cost = float(input("Enter the base delivery cost: "))
    number_of_package = int(input("Enter number of packages: "))
    delivery_cost_list = []
    packages = []
    result = []
    for i in range(1,number_of_package+1):
        idp = input(f"Enter the id of the package: ")
        weight = float(input(f"Enter the weight of the package {i} (in kg): "))
        distance = float(input(f"Enter the distance of delivery for package {i} (in km): "))
        offer = input(f"Enter the offer code (optional) for package {i}: ")
        packages.append({'id':idp, 'weight': weight, 'distance': distance, 'offer': offer})
    number_of_vehicles = int(input("Enter number of vehicles: "))
    max_speed = int(input("Enter maximum speed: "))
    max_weight = int(input("Enter maximum carriable weight: "))
    delivery_time_list = calculate_delivery_time(base_cost, packages, number_of_vehicles, max_speed, max_weight)
    for i in range(len(packages)):
      pk, discount, total_cost = calculate_delivery_cost(i+1, base_cost, packages[i]["weight"], packages[i]["distance"], packages[i]["offer"])
      delivery_cost_list.append({'id': pk, 'discount': discount, 'total_cost': total_cost})
    # print("\n",delivery_time_list)
    # print("\n",delivery_cost_list)
    if len(delivery_time_list) > 0:
      for item in delivery_time_list:
        for pkg in delivery_cost_list:
          if item['id'].strip() == pkg['id'].strip():
            print(f"\n{pkg['id']} {pkg['discount']} {pkg['total_cost']} {item['time']}")
    # for i in range(len(result)):
    #     print(f'{result[i]}')

if __name__ == '__main__':
    main()
